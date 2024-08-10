import html2canvas from "html2canvas";
import { useState } from "react";

const SaveScreenshot = () => {
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const DownloadCanvasAsImage = async () => {
    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "Completionist.png");
    let canvas = await html2canvas(
      document.getElementById("admin-statistics"),
      {
        proxy: "https://corsproxy.io/?",
      }
    );
    let dataURL = (canvas as any).toDataURL("image/png");
    let url = dataURL.replace(
      /^data:image\/png/,
      "data:application/octet-stream"
    );
    downloadLink.setAttribute("href", url);
    downloadLink.click();
  };

  const showCopiedToast = (timeoutMs: number) => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, timeoutMs);
  };

  const CopyCanvasAsImage = async () => {
    showCopiedToast(3000);
    html2canvas(document.getElementById("admin-statistics"), {
      proxy: "https://corsproxy.io/?",
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        navigator.clipboard
          .write([
            new ClipboardItem(
              Object.defineProperty({}, blob.type, {
                value: blob,
                enumerable: true,
              })
            ),
          ])
          .then(() => {
            // show toast
          });
      });
    });
  };
  return (
    <ul
      className="inline-list bg-secondary"
      style={{
        overflow: "hidden",
        margin: "auto",
        marginRight: 0,
        padding: 0,
        borderRadius: 5,
      }}
      data-html2canvas-ignore="true"
    >
      <button
        className="btn btn-secondary"
        onClick={() => {
          CopyCanvasAsImage();
        }}
      >
        Screenshot{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-copy"
          viewBox="0 0 16 16"
          style={{ marginLeft: 10 }}
        >
          <path
            fill-rule="evenodd"
            d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
          />
        </svg>
        <div
          className="bg-dark-subtle"
          style={{
            position: "absolute",
            padding: 5,
            borderRadius: 5,
            marginLeft: 50,
            marginTop: -10,
            width: "auto",
            color: `var(--bs-dark)`,
            visibility: toastVisible ? "visible" : "hidden",
            transition: "0.3s",
            opacity: toastVisible ? 1 : 0,
          }}
        >
          Copied!
        </div>
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => {
          DownloadCanvasAsImage();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-download"
          viewBox="0 0 16 16"
        >
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
        </svg>
      </button>
    </ul>
  );
};

export default SaveScreenshot;
