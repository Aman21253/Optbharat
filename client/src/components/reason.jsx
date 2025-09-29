// src/components/WhyIndianProduct.jsx
import React from "react";
import "./reason.css";
import Header from "../components/header";

function WhyIndianProduct() {
  const rippleData = [
    { round: "Initial Spend", retainedIndia: 10000, retainedForeign: 10000 },
    { round: "Round 2", retainedIndia: 7500,  retainedForeign: 2250 },
    { round: "Round 3", retainedIndia: 5625,  retainedForeign: 1688 },
    { round: "Round 4", retainedIndia: 4219,  retainedForeign: 1266 },
    { round: "Round 5", retainedIndia: 3164, retainedForeign: 950 },
    { round: "Round 6", retainedIndia: 2373, retainedForeign: 713 },
  ];
  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🇮🇳 Why Indians Should Buy from India
      </h1>

      <section>
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">It’s not just a purchase. It’s a powerful choice.</h2>
        <p>
          Every rupee you spend is a vote — for the kind of India you want to build.
        </p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        💥 Multiply the Impact
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-1">When you buy Indian, your money doesn’t stop at one person. It moves. It multiplies.</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Creates jobs across the value chain</li>
          <li>Fuels Indian entrepreneurship</li>
          <li>Strengthens the rupee, reduces imports</li>
          <li>Grows tax revenue for national development</li>
        </ul>
        <br />
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">One purchase. A hundred ripple effects.</h2>
        <p className="mt-2 font-medium">👉 Support Indian brands — fuel Indian dreams.</p>
      </section>
      
      <h3>
          📊 Assumptions Behind the Numbers
        </h3>
        <section className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              If you spend <b>₹10,000</b>:
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <b>Indian apparel brand</b>: 100% of ₹10,000 stays in India.
                </li>
                <li>
                  <b>Foreign brand</b>: 30% stays in India, 70% goes abroad.
                </li>
              </ul>
            </li>
            <li>
              <b>Marginal Propensity to Consume (MPC) in India</b>: 0.75 → 75%
              of income is re-spent locally in each round.
            </li>
          </ul>
        </section>

        <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">💹 The Ripple Effect of Your ₹10,000</h1>
      <section>
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 shadow-md">
            <thead className="bg-green-100 text-gray-800">
              <tr>
                <th className="px-4 py-2 border">Spending Round</th>
                <th className="px-4 py-2 border">Retained in India (₹)</th>
                <th className="px-2 py-1 border">Spend in foregin (₹)</th>
              </tr>
            </thead>
            <tbody>
              {rippleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border">{row.round}</td>
                  <td className="px-4 py-2 border text-green-700">{row.retainedIndia}</td>
                  <td className="px-2 py-1 border text-red-600">{row.retainedForeign}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-4 py-2 border">Total Retained</td>
                <td className="px-4 py-2 border text-green-700">32,881</td>
                <td className="px-4 py-2 border text-red-600">9,867</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conclusion Box */}
        <div className="mt-6 bg-yellow-50 p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Conclusion</h2>
          <p className="text-gray-700">
            Buying from <b>Indian brands</b>: ₹10,000 creates <b className="text-green-700">₹32,881</b> worth of economic activity in India.
          </p>
          <p className="text-gray-700">
            Buying from <b>foreign brands</b>: ₹10,000 creates only <b className="text-red-600">₹9,867</b> worth of economic activity in India.
          </p>
          <p className="mt-3 font-medium text-blue-800">
            👉 That’s a <b>3.3x greater impact</b> when you buy Indian.
          </p>
        </div>
      </section>


      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🏠 Charity Begins at Home
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-1">Ask yourself:</h2>
          <ul>Are you building, selling, or working for an Indian company?</ul>
          <ul>Would your life improve if more people bought from you?</ul>
          <ul>If yes — extend the same support to others like you.</ul>
          <ul>Don’t just say “local support matters” <b>- be that support.</b></ul>
        
        <p className="mt-2 font-medium">👉 Buy from Indian makers the way you want others to buy from you.</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🧠 Break the Colonial Mindset
      </h1>
      <section>
        <ul> <i> "Yeh toh foreign jaisa lagta hai!" — Why is that a compliment?</i></ul>
        <p>&nbsp;&nbsp;&nbsp;&nbsp; This thinking comes from our past — but it’s time to move forward.</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We’ve always had world-class:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Kolhapuri chappals sold abroad at ₹1 lakh</li>
          <li>Ayurveda rebranded and sold back to us</li>
          <li>Indian textiles worn by royalty, globally</li>
        </ul>
        <p>Stop undervaluing the local.</p>
        <p className="mt-2 font-medium">👉 Be proud of what we make. Back our brilliance.</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🏏 Put Your Money Where Your Mouth Is
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-1">🏏 Boycotting foreign brands doesn’t build India. Buying Indian ones does.</h2>
        <p className="mt-2 font-medium">👉 Want to help India rise? Start with your wallet.</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🎯 Indian Brands = Made for Indian Needs
      </h1>
      <section>
        <ul className="list-disc list-inside space-y-1">
          <li>Skincare for our climate</li>
          <li>Food for our palate</li>
          <li>Solutions for our infrastructure</li>
        </ul>
        <p className="mt-2 font-medium">👉 Why settle for foreign fits when desi delivers better?</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        🌍Cultural Confidence Begins with Economic Confidence
      </h1>
      <section>
        <p>We cheer when our movies win Oscars. Let’s do the same when our brands win shelves.</p>
        <p>Every time you back an Indian product, you send a <b>We believe in our own.</b></p>
        <p className="mt-2 font-medium">👉 Confidence isn’t borrowed — it’s built.</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        💸 When Your Money Stays, It Builds
      </h1>
      <section>
        <p>Every rupee that stays in India:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Gets reinvested in local jobs</li>
          <li>Builds factories, startups, schools</li>
          <li>Creates new innovations</li>
        </ul>
        <p><b>Imports create distance. Indian brands create development.</b></p>
        <p className="mt-2 font-medium">👉 Spend local. Grow local. Win global.</p>
      </section>

      <h1 className="max-w-4xl mx-auto px-4 py-10 space-y-10 text-gray-400">
        ❗Stop Asking “What’s So Special About This Indian Brand?”
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-indigo-600 mb-1">Start Asking — “Why Not?”</h2>
        <p>We don’t need pity buys. We need <b>pride purchases</b>. Because our brands deserve it.</p>
        <h2 className="text-xl font-semibold text-indigo-600 mb-1">OptBharat. Because you are also Bharat.</h2>
        <p className="mt-1">Not because you have to — but because it makes sense.</p>
      </section>
    </div>
    </>
  );
}

const Section = ({ title, content, children }) => (
  <section className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">{title}</h2>
    {content && <p className="text-gray-700 mb-3">{content}</p>}
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul className="list-disc list-inside space-y-1 text-gray-700">
    {items.map((item, idx) => (
      <li key={idx}>{item}</li>
    ))}
  </ul>
);

export default WhyIndianProduct;
