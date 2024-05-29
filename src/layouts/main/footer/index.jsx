export default function Footer() {
  return (
    <div className="mt-auto">
      <div className="mt-4 p-5 bg-[#1b1b1b] shadow shadow-[#ffdd29] rounded-md flex flex-col items-center justify-center text-center">
        <p>Copyright &copy; {new Date().getFullYear()}</p>
        <p>
          Powered by{" "}
          <a
            className="link"
            href="https://github.com/siracyakut"
            target="_blank"
          >
            Siraç Yakut
          </a>{" "}
          &{" "}
          <a
            className="link"
            href="https://www.tensorflow.org/"
            target="_blank"
          >
            TensorFlow
          </a>
        </p>
      </div>
    </div>
  );
}
