import { Camera, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setError, setImage } from "~/store/app/actions";

export default function Header() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
        setError(false);
      };
      img.onerror = () => {
        setError(true);
      };
    };

    file && getImage();
  }, [file]);

  return (
    <header className="z-20 w-full grid place-items-center gap-y-4 md:flex md:items-center md:justify-between bg-[#1b1b1b] shadow shadow-[#ffdd29] mb-4 rounded-md p-5">
      <Link to="/" className="font-bold text-2xl">
        AI Yüz Tanıma Servisi
      </Link>
      <div className="w-full md:w-max grid place-items-center gap-y-4 md:flex md:items-center md:gap-x-5">
        <label
          htmlFor="file-input"
          className="cursor-pointer w-full md:w-max flex items-center justify-center gap-x-2 shadow shadow-[#ffdd29] px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          <ImageIcon className="flex-shrink-0" />
          <p>Resim Tarat</p>
        </label>
        <Link
          to="/camera"
          className="w-full md:w-max flex items-center justify-center gap-x-2 shadow shadow-[#ffdd29] px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          <Camera className="flex-shrink-0" />
          <p>Kamerayı Tarat</p>
        </Link>
        <input
          id="file-input"
          className="invisible hidden"
          type="file"
          onChange={(e) => {
            navigate("/");
            setFile(e.target.files[0]);
          }}
        />
      </div>
    </header>
  );
}
