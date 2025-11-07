import type { Bill } from "@shared/schema";

interface BillPrintProps {
  bill: Bill;
}

export default function BillPrint({ bill }: BillPrintProps) {
  return (
    <div className="bg-white text-black p-8 max-w-[800px] mx-auto print:p-0 print:max-w-full">
      <div className="border-2 border-black">
        {/* Header Section */}
        <div className="border-b-2 border-black p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1"></div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">BILL</div>
              <div className="text-sm">
                <div>Mob.: 9552403196</div>
                <div className="ml-12">7218505486</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
              Mahesh Electrical And Engineers
            </h1>
            <p className="text-sm mb-1">
              All types of Industrial Equipment Electrical Repairing Works,
            </p>
            <p className="text-sm mb-2">
              Industrial Wiring & Project Work
            </p>
            <p className="text-sm">
              Tilak Residency, B-6-9, Indrayani Nagar, Bhosari, Pune - 411 026.
            </p>
          </div>
        </div>

        {/* Customer and Bill Details */}
        <div className="border-b-2 border-black p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <div className="text-sm mb-1">M/s.</div>
                <div className="font-semibold border-b border-black pb-1">
                  {bill.customerName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm">Bill No.: </span>
                <span className="font-bold text-2xl ml-2">{bill.billNo}</span>
              </div>
              <div>
                <span className="text-sm">Date: </span>
                <span className="font-semibold ml-2">
                  {new Date(bill.date).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="border-r-2 border-black p-2 text-left w-16">
                Sr.<br />No.
              </th>
              <th className="border-r-2 border-black p-2 text-left">
                Description
              </th>
              <th className="border-r-2 border-black p-2 text-center w-24">
                Qty.
              </th>
              <th className="border-r-2 border-black p-2 text-center w-32">
                Rate
              </th>
              <th className="p-2 text-center w-32">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {bill.lineItems.map((item, index) => (
              <tr
                key={item.srNo}
                className={index < bill.lineItems.length - 1 ? "border-b border-black" : ""}
              >
                <td className="border-r-2 border-black p-2 text-center align-top">
                  {item.srNo}
                </td>
                <td className="border-r-2 border-black p-2 align-top">
                  {item.description}
                </td>
                <td className="border-r-2 border-black p-2 text-center align-top">
                  {item.qty}
                </td>
                <td className="border-r-2 border-black p-2 text-center align-top">
                  {item.rate.toFixed(2)}
                </td>
                <td className="p-2 text-center align-top">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            
            {/* Add empty rows if needed for spacing */}
            {Array.from({ length: Math.max(0, 5 - bill.lineItems.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-black">
                <td className="border-r-2 border-black p-2 h-16">&nbsp;</td>
                <td className="border-r-2 border-black p-2">&nbsp;</td>
                <td className="border-r-2 border-black p-2">&nbsp;</td>
                <td className="border-r-2 border-black p-2">&nbsp;</td>
                <td className="p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Section */}
        <div className="border-t-2 border-black">
          <div className="grid grid-cols-2">
            <div className="border-r-2 border-black p-4">
              <div className="text-sm mb-2">Rs. in words</div>
              <div className="text-sm font-medium leading-relaxed">
                {bill.amountInWords}
              </div>
            </div>
            <div className="p-4">
              <div className="border-b-2 border-black pb-2 mb-4">
                <div className="text-right font-bold text-lg">TOTAL</div>
              </div>
              <div className="text-right mb-4">
                <div className="font-bold text-xl">₹{bill.total.toFixed(2)}</div>
              </div>
              <div className="text-center mt-8">
                <div className="font-bold mb-8" style={{ fontFamily: 'serif' }}>
                  For Mahesh Electrical<br />And Engineers
                </div>
                <div className="text-sm mt-12">
                  Authorised Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 0.5cm;
            size: A4;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:max-w-full {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
