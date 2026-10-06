'use client';

import React, { useState } from 'react';
import { Heart, ShieldCheck, CheckCircle, AlertCircle, FileText, CreditCard, Building } from 'lucide-react';

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [taxReceiptRequested, setTaxReceiptRequested] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);

  const activeAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount < 10) {
      setError('Minimum donation amount is ₹10');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Order on Server
      const orderRes = await fetch('/api/donate/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          donorName,
          donorEmail,
          donorPhone,
          panNumber,
          address,
          taxReceiptRequested,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      // 2. Open Razorpay or execute test mode verification
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: 'INR',
          name: 'Safe Hands Human Resources Organization',
          description: 'Charitable Donation - Safe Hands NGO',
          order_id: orderData.orderId,
          prefill: {
            name: donorName,
            email: donorEmail,
            contact: donorPhone,
          },
          theme: {
            color: '#023613',
          },
          handler: async function (response: any) {
            await verifyPayment(orderData.orderId, response.razorpay_payment_id, response.razorpay_signature);
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback verification for test mode / mock checkout
        await verifyPayment(orderData.orderId);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing error');
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId: string, paymentId?: string, signature?: string) => {
    try {
      const verifyRes = await fetch('/api/donate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          mockSuccess: true,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Verification failed');
      }

      setReceipt(verifyData.donation);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#023613] text-white py-16 px-4 sm:px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
            80G Tax Deductible NGO Donation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Support Safe Hands NGO
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Your generous contribution directly funds tree saplings, free youth vocational training, and single women livelihood empowerment.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        {receipt ? (
          /* Thank You & Receipt Display */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-emerald-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Thank You for Your Donation!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Your donation of <strong>₹{receipt.amount.toLocaleString()}</strong> has been successfully received. A 80G tax-exempt receipt has been generated.
            </p>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-[#f7faf6] dark:bg-slate-800 p-6 rounded-2xl border border-emerald-100 dark:border-slate-700 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2 font-sans font-bold text-slate-900 dark:text-white">
                <span>Receipt No:</span>
                <span className="text-emerald-700 dark:text-emerald-400">{receipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-semibold">{receipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span>{receipt.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span>{receipt.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{receipt.amount}</span>
              </div>
              {receipt.panNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">PAN Number:</span>
                  <span className="font-semibold">{receipt.panNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-[#023613] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Print Tax Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                <span>Make Another Donation</span>
              </button>
            </div>
          </div>
        ) : (
          /* Donation Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600 fill-current" />
                  <span>Choose Donation Amount</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Select a preset amount or enter a custom sum (INR ₹).</p>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Preset Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[500, 1000, 2500, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-2xl text-xs font-extrabold border transition-all ${
                      amount === preset && !customAmount
                        ? 'bg-[#023613] text-white border-[#023613] shadow-md scale-105'
                        : 'bg-[#f7faf6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Custom Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter custom amount in INR"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PAN Card Number (For 80G Tax Exemption)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="taxReceipt"
                    checked={taxReceiptRequested}
                    onChange={(e) => setTaxReceiptRequested(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="taxReceipt" className="text-slate-600 dark:text-slate-300 text-[11px]">
                    I request an 80G Tax Exemption receipt for this donation.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{loading ? 'Processing Order...' : `Proceed to Pay ₹${activeAmount.toLocaleString()}`}</span>
                </button>
              </form>
            </div>

            {/* Direct Bank Details & Tax Notice */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#023613] text-white p-6 rounded-3xl space-y-4 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400">
                  <Building className="w-5 h-5" />
                  <h3 className="font-extrabold text-base text-white">Direct Bank Transfer</h3>
                </div>

                <p className="text-xs text-emerald-100 leading-relaxed">
                  You may also transfer funds directly to our official NGO bank account:
                </p>

                <div className="bg-emerald-950 p-4 rounded-2xl text-xs space-y-2 font-mono text-emerald-200 border border-emerald-800">
                  <p><strong>Account Name:</strong> Safe Hands Human Resources Organization</p>
                  <p><strong>Bank:</strong> Indian Bank</p>
                  <p><strong>Branch:</strong> SME Branch, Thuvakudi, Trichy</p>
                  <p><strong>Account No:</strong> XXXXXX3391</p>
                  <p><strong>IFSC Code:</strong> IDIB000S175</p>
                </div>
              </div>

              <div className="bg-[#f7faf6] dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm">80G & 12A Tax Exemption Notice</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Safe Hands Human Resources Organization is a registered non-profit organization under 12A and 80G of the Income Tax Act, Govt of India. All online and bank donations qualify for 50% tax deduction.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
