import Webcam from "react-webcam";
import { useEffect, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CameraPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.load("/models"),
        faceapi.nets.ssdMobilenetv1.load("/models"),
        faceapi.nets.ageGenderNet.load("/models"),
        faceapi.nets.faceLandmark68Net.load("/models"),
        faceapi.nets.faceRecognitionNet.load("/models"),
        faceapi.nets.faceExpressionNet.load("/models"),
      ])
        .then(() => console.log("modeller yüklendi"))
        .catch((e) => console.log(e));
    };

    loadModels();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (webcamRef.current) {
      webcamRef.current.video.onloadeddata = async () => {
        canvasRef.current.width = webcamRef.current.video.clientWidth;
        canvasRef.current.height = webcamRef.current.video.clientHeight;
        await webcamRef.current.video.play();
        handleVideo(webcamRef.current.video, canvasRef.current);
      };
    }
  }, [webcamRef]);

  const drawFaces = (canvas, data, fps) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'small-caps 20px "Segoe UI"';
    ctx.fillStyle = "white";
    ctx.fillText(`FPS: ${fps}`, 10, 25);
    for (const person of data) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "deepskyblue";
      ctx.fillStyle = "deepskyblue";
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.rect(
        person.detection.box.x,
        person.detection.box.y,
        person.detection.box.width,
        person.detection.box.height,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
      const expression = Object.entries(person.expressions).sort(
        (a, b) => b[1] - a[1],
      );
      ctx.fillStyle = "black";
      ctx.fillText(
        `gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`,
        person.detection.box.x,
        person.detection.box.y - 59,
      );
      ctx.fillText(
        `expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`,
        person.detection.box.x,
        person.detection.box.y - 41,
      );
      ctx.fillText(
        `age: ${Math.round(person.age)} years`,
        person.detection.box.x,
        person.detection.box.y - 23,
      );
      ctx.fillText(
        `roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`,
        person.detection.box.x,
        person.detection.box.y - 5,
      );
      ctx.fillStyle = "lightblue";
      ctx.fillText(
        `gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`,
        person.detection.box.x,
        person.detection.box.y - 60,
      );
      ctx.fillText(
        `expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`,
        person.detection.box.x,
        person.detection.box.y - 42,
      );
      ctx.fillText(
        `age: ${Math.round(person.age)} years`,
        person.detection.box.x,
        person.detection.box.y - 24,
      );
      ctx.fillText(
        `roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`,
        person.detection.box.x,
        person.detection.box.y - 6,
      );
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "lightblue";
      const pointSize = 2;
      for (let i = 0; i < person.landmarks.positions.length; i++) {
        ctx.beginPath();
        ctx.arc(
          person.landmarks.positions[i].x,
          person.landmarks.positions[i].y,
          pointSize,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }
    }
  };

  const handleVideo = (video, canvas) => {
    if (!video || video.paused) return;
    const t0 = performance.now();
    faceapi
      .detectAllFaces(
        video,
        new faceapi.SsdMobilenetv1Options({
          minConfidence: 0.26,
          maxResults: 10,
        }),
      )
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()
      .then((result) => {
        const fps = 1000 / (performance.now() - t0);
        drawFaces(canvas, result, fps.toLocaleString());
        requestAnimationFrame(() => handleVideo(video, canvas));
      })
      .catch((err) => {
        console.log(`Detect Error: ${String(err)}`);
      });
  };

  const resizeCanvas = async () => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.video.clientWidth;
      canvas.height = video.video.clientHeight;
    }
  };

  return (
    <div className="w-full h-[720px] flex items-center justify-center relative bg-[#1b1b1b] shadow shadow-[#ffdd29] rounded-md overflow-hidden">
      <Webcam
        className="absolute"
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
      />
      <canvas ref={canvasRef} className="absolute" />
    </div>
  );
}
