import { useApp } from "~/store/app/hooks";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { CircleX } from "lucide-react";

export default function FaceImage() {
  const { image } = useApp();
  const { url } = image;
  const imgRef = useRef();
  const canvasRef = useRef();
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    setLoading(true);

    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.load("/models"),
        faceapi.nets.ssdMobilenetv1.load("/models"),
        faceapi.nets.ageGenderNet.load("/models"),
        faceapi.nets.faceLandmark68Net.load("/models"),
        faceapi.nets.faceRecognitionNet.load("/models"),
        faceapi.nets.faceExpressionNet.load("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    if (imgRef.current) {
      loadModels();

      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [image]);

  const resizeCanvas = async () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      setLoading(true);
      await handleImage();
    }
  };

  const handleImage = async () => {
    setDetections(
      await faceapi
        .detectAllFaces(
          imgRef.current,
          new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.26,
            maxResults: 10,
          }),
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender(),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      document.querySelector("#image-container").style.height =
        imgRef.current.clientHeight + 30 + "px";

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        imgRef.current,
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });

      const resized = faceapi.resizeResults(detections, {
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      //faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      resized.forEach((detection) => {
        const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
          label:
            detection.detection.score.toFixed(2) +
            " " +
            detection.gender +
            " " +
            Math.round(detection.age) +
            " years",
        });
        drawBox.draw(canvasRef.current);
      });
    }
  }, [loading]);

  return (
    <>
      {loading && (
        <div className="absolute z-20 inline-block h-20 w-20 animate-spin rounded-full border-8 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
      )}
      {!loading && detections.length === 0 && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-10">
          <div className="bg-red-200 text-red-700 border border-red-700 px-4 py-2 w-max flex items-center gap-x-4 rounded-md">
            <CircleX />
            <p>Fotoğrafta herhangi bir yüz tanınamadı!</p>
          </div>
        </div>
      )}
      <img
        ref={imgRef}
        className="absolute"
        crossOrigin="anonymous"
        src={url}
        alt=""
      />
      <canvas className="absolute" ref={canvasRef} />
    </>
  );
}
