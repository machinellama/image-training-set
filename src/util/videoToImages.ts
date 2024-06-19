import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import JSZip from 'jszip';
import { ImageUpload } from '@/types/ImageUpload';

// Extend the FS method types
declare module '@ffmpeg/ffmpeg' {
  interface FS {
    (method: 'readdir', dirPath: string): string[];
    (method: 'readFile', fileName: string): Uint8Array;
    (method: 'writeFile', fileName: string, data: Uint8Array): void;
  }
}

export default async function({
  videoURL,
  startTime,
  endTime
}): Promise<ImageUpload[]> {
  const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    log: true
  });
  await ffmpeg.load();

  const videoBlob = await fetchFile(videoURL);
  ffmpeg.FS('writeFile', 'video.mp4', videoBlob);

  let startTimeFilter = '';
  let endTimeFilter = '';

  if (startTime && startTime > 0) {
    startTimeFilter = `-ss ${startTime}`;
  }

  if (endTime && endTime > 0) {
    endTimeFilter = `-to ${endTime}`;
  }

  await ffmpeg.run(
    '-i', 'video.mp4',
    ...startTimeFilter.split(' '),
    ...endTimeFilter.split(' '),
    '-vf', `fps=1`, '%03d.png'
  );

  const zip = new JSZip();
  const outputFiles = ffmpeg.FS('readdir' as any, '/').filter(file => file.endsWith('.png'));

  const returnImages = outputFiles?.map((file) => {
    const data = ffmpeg.FS('readFile' as any, file);
    const src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));
    return { name: file, type: 'image/png', src };
  });

  return returnImages;
}
