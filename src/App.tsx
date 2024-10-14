import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Logo from '/public/logo.png'; // Make sure the path to the logo image is correct

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyRegNo: '',
    vatNo: '',
    contactPerson: '',
    telephoneNo: '',
    email: '',
    vessel: '',
    billNo: '',
  });

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [formError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleGeneratePDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure the URL is valid and defined
      const url: string | undefined = '/CI.pdf';

      if (!url) {
        console.error('The URL is undefined or invalid.');
        setLoading(false);
        return;
      }

      // Fetch the existing PDF bytes
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const existingPdfBytes = await response.arrayBuffer();

      // Load a PDFDocument from the existing PDF
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the first page of the document
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Define font size and positions for fields
      const fontSize = 12;
      const { height } = firstPage.getSize();

      // Draw text fields onto the first page
      firstPage.drawText(formData.companyName, { x: 100, y: height - 100, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.companyRegNo, { x: 100, y: height - 120, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.vatNo, { x: 100, y: height - 140, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.contactPerson, { x: 100, y: height - 160, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.telephoneNo, { x: 100, y: height - 180, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.email, { x: 100, y: height - 200, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.vessel, { x: 100, y: height - 220, size: fontSize, color: rgb(0, 0, 0) });
      firstPage.drawText(formData.billNo, { x: 100, y: height - 240, size: fontSize, color: rgb(0, 0, 0) });

      // Check if the signature exists
      const trimmedCanvas = sigCanvas.current?.getTrimmedCanvas();
      if (!trimmedCanvas) {
        console.error('Signature canvas is empty or not available.');
        setSignatureError('Please provide a signature.');
        setLoading(false);
        return;
      }

      // Convert the signature to image
      const signatureImage = trimmedCanvas.toDataURL('image/png');

      if (!signatureImage) {
        console.error('Failed to get signature image.');
        setLoading(false);
        return;
      }

      // Embed the signature image in the PDF
      const pngImageBytes = await fetch(signatureImage).then((res) => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      firstPage.drawImage(pngImage, {
        x: 100,
        y: height - 300,
        width: 150,
        height: 50,
      });

      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();

      // Trigger file download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'completed-form.pdf');

      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* Background Design */}
    <div className="absolute inset-0 w-full h-full z-0">
      <div className="h-[50%] bg-gray-100"></div>
      <div
        className="h-[50%] bg-customRed"
        style={{ clipPath: 'polygon(0 10%, 100% 0%, 100% 100%, 0% 90%)' }}
      ></div>
    </div>
      <div className="relative z-10 bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-lg w-full max-w-lg mx-auto mt-10 mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Import Clearing Instruction</h2>

        {formError && <p className="text-red-500 mb-4">{formError}</p>}

        <form id="form" onSubmit={handleGeneratePDF} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-gray-700">Company Reg No</label>
              <input
                type="text"
                name="companyRegNo"
                value={formData.companyRegNo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter company registration number"
              />
            </div>

            <div>
              <label className="block text-gray-700">VAT No</label>
              <input
                type="text"
                name="vatNo"
                value={formData.vatNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter VAT number"
              />
            </div>

            <div>
              <label className="block text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter contact person"
              />
            </div>

            <div>
              <label className="block text-gray-700">Telephone No</label>
              <input
                type="text"
                name="telephoneNo"
                value={formData.telephoneNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter telephone number"
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-gray-700">Vessel</label>
              <input
                type="text"
                name="vessel"
                value={formData.vessel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter vessel name"
              />
            </div>

            <div>
              <label className="block text-gray-700">Bill No</label>
              <input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
                placeholder="Enter bill number"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Signature</h3>
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{ width: 500, height: 200, className: 'border border-gray-300 rounded-md' }}
            />
            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 text-blue-500 underline"
            >
              Clear Signature
            </button>
            {signatureError && <p className="text-red-500 mt-2">{signatureError}</p>}
          </div>

          <button
            type="submit"
            className={`mt-6 bg-plum hover:bg-plum-dark text-white py-2 px-5 rounded-lg w-full flex justify-center items-center transition-all duration-300 ease-in-out shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                Generating PDF...
              </span>
            ) : (
              'Generate PDF'
            )}
          </button>
        </form>
      </div>

      <footer className="relative z-20 w-full bg-white py-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <span className="text-sm text-gray-500 mr-2">Powered by</span>
          <img src={Logo} alt="Company Logo" className="w-16 h-auto" />
        </div>
      </footer>
    </div>
  );
};

export default App;