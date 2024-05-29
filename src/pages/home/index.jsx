import { useApp } from "~/store/app/hooks";
import FaceImage from "~/components/face-image";
import { CircleX } from "lucide-react";

export default function Home() {
  const { image } = useApp();

  return image ? (
    <div
      style={{ height: image.height }}
      id="image-container"
      className="flex items-center justify-center relative bg-[#1b1b1b] shadow shadow-[#ffdd29] rounded-md overflow-hidden"
    >
      <FaceImage />
    </div>
  ) : (
    <div className="w-full h-full bg-[#1b1b1b] shadow shadow-[#ffdd29] p-5 rounded-md flex items-center justify-center">
      <div className="flex items-center gap-x-2">
        <CircleX />
        <p>Lütfen bir resim taratın ya da kameranızı açın!</p>
      </div>
    </div>
  );
}
