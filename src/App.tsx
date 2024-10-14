import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaPlane } from 'react-icons/fa';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyRegNo: '',
    vatNo: '',
    contactPerson: '',
    telephoneNo: '',
    email: '',
    vessel: '',
    billNo: ''
  });

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleGeneratePDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    if (!formData.companyName || !formData.email || !formData.vessel) {
      setFormError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (sigCanvas.current?.isEmpty()) {
      setSignatureError('Please provide a signature.');
      setLoading(false);
      return;
    }

    // Generate PDF
    const formElement = document.getElementById('form');
    if (formElement) {
      const canvas = await html2canvas(formElement);
      const imgData = canvas.toDataURL('image/png');

      // Define A4 size in mm (210 x 297 mm)
      const imgWidth = 210; // A4 page width in mm
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      const pdf = new jsPDF('portrait', 'mm', 'a4');

      // If the content height is longer than A4, add pages
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save('clearing-instruction.pdf');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* Background design */}
      <div className="absolute inset-0 z-0">
        <div className="h-[50%] bg-gray-100"></div>
        <div
          className="h-[50%] bg-plum"
          style={{ clipPath: 'polygon(0 10%, 100% 0%, 100% 100%, 0% 90%)' }}
        ></div>
      </div>

      {/* Form Section */}
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
                <FaPlane className="mr-2 animate-spin" /> Generating PDF...
              </span>
            ) : (
              'Generate PDF'
            )}
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="relative z-20 w-full bg-white py-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <span className="text-sm text-gray-500 mr-2">Powered by</span>
          <img src="/assets/logo.png" alt="Logo" className="w-16 h-auto" />
        </div>
      </footer>
    </div>
  );
};

export default App;