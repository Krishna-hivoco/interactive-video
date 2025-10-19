// import React, { useState, useRef } from 'react';
// import { Upload, Link } from 'lucide-react';

// export default function QRImageGenerator() {
//   const [imageUrl, setImageUrl] = useState('');
//   const [url, setUrl] = useState('');
//   const [qrGenerated, setQrGenerated] = useState(false);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageUrl(event.target.result);
//         setQrGenerated(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const generateQRCode = async () => {
//     if (!imageUrl || !url) {
//       alert('Please upload an image and enter a URL');
//       return;
//     }

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     const img = new Image();
//     img.onload = () => {
//       // Fixed size - 400x400
//       const size = 800;
//       canvas.width = size;
//       canvas.height = size;
      
//       // Draw background image to fill entire 400x400 canvas
//       ctx.drawImage(img, 0, 0, size, size);
      
//       // Apply darken filter to make background less bright
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
//       ctx.fillRect(0, 0, size, size);
      
//       // QR code size - slightly smaller (350x350) centered for better scanning
//       const qrSize = 800;
//       const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=000000&color=FFFFFF&margin=10`;
      
//       const qrImg = new Image();
//       qrImg.crossOrigin = 'anonymous';
//       qrImg.onload = () => {
//         // Create temporary canvas to make QR transparent
//         const tempCanvas = document.createElement('canvas');
//         tempCanvas.width = qrSize;
//         tempCanvas.height = qrSize;
//         const tempCtx = tempCanvas.getContext('2d');
        
//         // Draw QR code to temp canvas
//         tempCtx.drawImage(qrImg, 0, 0);
        
//         // Get image data - make background semi-transparent instead of fully transparent
//         const imageData = tempCtx.getImageData(0, 0, qrSize, qrSize);
//         const data = imageData.data;
        
//         for (let i = 0; i < data.length; i += 4) {
//           const r = data[i];
//           const g = data[i + 1];
//           const b = data[i + 2];
          
//           // If pixel is black (background), make it transparent
//           if (r < 50 && g < 50 && b < 50) {
//             data[i + 3] = 0;
//           } else {
//             // Keep white pixels fully opaque for better contrast
//             data[i + 3] = 255;
//           }
//         }
        
//         tempCtx.putImageData(imageData, 0, 0);
        
//         // Draw white QR code centered on canvas
//         const qrX = (size - qrSize) / 2;
//         const qrY = (size - qrSize) / 2;
//         ctx.drawImage(tempCanvas, 0, 0, qrSize, qrSize, qrX, qrY, qrSize, qrSize);
        
//         console.log('400x400 scannable QR code created successfully');
//         setQrGenerated(true);
//       };
//       qrImg.onerror = (error) => {
//         console.error('Error loading QR code:', error);
//         alert('Failed to generate QR code. Please try again.');
//       };
//       qrImg.src = qrApiUrl;
//     };
//     img.onerror = (error) => {
//       console.error('Error loading image:', error);
//       alert('Failed to load image. Please try again.');
//     };
//     img.src = imageUrl;
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement('a');
//     link.download = 'qr-code-image.png';
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
//           <p className="text-gray-600 mb-8">Create a QR code with your custom image background</p>
          
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Upload Background Image
//               </label>
//               <div 
//                 onClick={() => fileInputRef.current.click()}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
//               >
//                 {imageUrl ? (
//                   <div className="flex flex-col items-center">
//                     <img src={imageUrl} alt="Preview" className="max-h-64 max-w-full object-contain rounded mb-2" />
//                     <p className="text-sm text-green-600 font-medium">Image uploaded successfully</p>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center">
//                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
//                     <p className="text-gray-600">Click to upload image</p>
//                     <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
//                   </div>
//                 )}
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Enter URL
//               </label>
//               <div className="relative">
//                 <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="url"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   placeholder="https://example.com"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 />
//               </div>
//             </div>

//             <button
//               onClick={generateQRCode}
//               disabled={!imageUrl || !url}
//               className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//             >
//               Generate QR Code
//             </button>

//             <canvas ref={canvasRef} style={{ display: qrGenerated ? 'block' : 'none' }} className="max-w-full h-auto mx-auto rounded border-2 border-gray-200 mt-6" />

//             {qrGenerated && (
//               <button
//                 onClick={downloadImage}
//                 className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
//               >
//                 Download Image
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

export default function QRImageGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 400,
        height: 400,
        margin: 0,
        data: "",
        dotsOptions: {
          color: "#FFFFFF",
          type: "dots"
        },
        backgroundOptions: {
          color: "transparent"  // Make QR transparent background
        },
        qrOptions: {
          errorCorrectionLevel: "H"
        }
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
        setQrGenerated(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    qrCodeInstance.current.update({
      data: url,
      dotsOptions: {
        color: "#FFFFFF",
        type: "dots"
      },
      backgroundOptions: {
        color: "transparent"
      }
    });
    qrCodeInstance.current.append(qrCodeRef.current);
    setQrGenerated(true);
  };

  const downloadImage = () => {
    qrCodeInstance.current.getRawData("png").then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code-image.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
          <p className="text-gray-600 mb-8">QR code on top of full-size background image with transparent QR background</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Background Image
              </label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Background" className="w-full max-w-[400px] max-h-[400px] object-cover rounded" />
                ) : (
                  <p className="text-gray-600">Click to upload image (PNG, JPG up to 10MB)</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={generateQRCode}
              disabled={!url}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Generate QR Code
            </button>

            {/* Wrapper with relative positioning to overlay */}
            <div style={{ position: 'relative', width: 400, height: 400, margin: 'auto', marginTop: 24 }}>
              {imageUrl && (
                <img src={imageUrl} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
              )}
              <div
                ref={qrCodeRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'  // Let clicks pass through
                }}
              />
            </div>

            {qrGenerated && (
              <button
                onClick={downloadImage}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Download QR Code Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
