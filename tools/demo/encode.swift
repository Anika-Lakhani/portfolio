// Turns timestamped JPEG frames into a constant-frame-rate H.264 MP4 using AVFoundation.
// Usage: swift encode.swift <framesDir> <frames.json> <out.mp4> <width> <height> <fps> <speed>
import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let a = CommandLine.arguments
let dir = URL(fileURLWithPath: a[1])
let out = URL(fileURLWithPath: a[3])
let W = Int(a[4])!, H = Int(a[5])!, fps = Int32(a[6])!, speed = Double(a[7])!

struct Frame: Decodable { let file: String; let t: Double }
let frames = try JSONDecoder().decode([Frame].self, from: Data(contentsOf: URL(fileURLWithPath: a[2])))
let t0 = frames[0].t
let duration = (frames.last!.t - t0) / speed

try? FileManager.default.removeItem(at: out)
let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 2_200_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
  ],
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
  kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H,
])
writer.add(input)
writer.movieFragmentInterval = .invalid
writer.shouldOptimizeForNetworkUse = true // moov atom up front, so it starts playing while downloading
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func load(_ name: String) -> CGImage {
  let src = CGImageSourceCreateWithURL(dir.appendingPathComponent(name) as CFURL, nil)!
  return CGImageSourceCreateImageAtIndex(src, 0, nil)!
}

var idx = 0
var cachedIdx = -1
var cached: CGImage?
let total = Int(duration * Double(fps))
for n in 0..<total {
  // Pick the last captured frame at or before this output time (screencast only sends frames on change)
  let srcT = t0 + Double(n) / Double(fps) * speed
  while idx + 1 < frames.count && frames[idx + 1].t <= srcT { idx += 1 }
  if idx != cachedIdx { cached = load(frames[idx].file); cachedIdx = idx }

  while !input.isReadyForMoreMediaData { usleep(2000) }
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
  CVPixelBufferLockBaseAddress(pb!, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8,
                      bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(),
                      bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.interpolationQuality = .high
  ctx.draw(cached!, in: CGRect(x: 0, y: 0, width: W, height: H))
  CVPixelBufferUnlockBaseAddress(pb!, [])
  adaptor.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(n), timescale: fps))
}
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
print("wrote \(out.path): \(total) frames, \(String(format: "%.1f", duration))s, status \(writer.status.rawValue)")
