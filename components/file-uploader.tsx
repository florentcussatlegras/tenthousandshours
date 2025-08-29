import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ChangeEvent, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files) {
        setFile(e.currentTarget.files[0]);
    }
  }

  function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append('file', file);

    // try {
    //     await axios.post("https://httpbin.org/post")
    // } catch {

    // }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        id="image"
        name="image"
        label="Image"
        labelPlacement="inside"
        classNames={{
          label: "self-start",
        }}
        size="md"
        onChange={handleFileChange}
      />
      {file && (
        <div className="mb-4 text-sm">
            <p>File name: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type: {file.type}</p>
        </div>
      )}
      {file && status !== "uploading" && 
        <Button>Télécharger</Button>
      }
    </div>
  );
}
