import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Building2, Search, ArrowRight, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Real-World Emergency Blood Response Coordination</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Direct & Compatible Emergency Blood Response
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            LIFE-LINK connects patients, hospitals, blood banks, and verified voluntary donors to expedite critical blood delivery during emergencies.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/find-blood"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded shadow-sm inline-flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Blood Urgently</span>
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded shadow-sm inline-flex items-center space-x-2"
            >
              <Heart className="w-4 h-4 text-red-600" />
              <span>Register as a Donor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real Emergency Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
            How LIFE-LINK Emergency Flow Operates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-gray-100 p-4 rounded bg-gray-50/50">
              <span className="text-xs font-bold text-red-600 uppercase">Step 1</span>
              <h3 className="font-semibold text-gray-900 text-sm mt-1">Create Blood Request</h3>
              <p className="text-xs text-gray-600 mt-1">
                Requester or hospital submits blood group, required units, location, and urgency.
              </p>
            </div>

            <div className="border border-gray-100 p-4 rounded bg-gray-50/50">
              <span className="text-xs font-bold text-red-600 uppercase">Step 2</span>
              <h3 className="font-semibold text-gray-900 text-sm mt-1">Matching & Notification</h3>
              <p className="text-xs text-gray-600 mt-1">
                System identifies compatible nearby available donors and sends instant in-app alerts.
              </p>
            </div>

            <div className="border border-gray-100 p-4 rounded bg-gray-50/50">
              <span className="text-xs font-bold text-red-600 uppercase">Step 3</span>
              <h3 className="font-semibold text-gray-900 text-sm mt-1">Donor Responds</h3>
              <p className="text-xs text-gray-600 mt-1">
                Available donors accept requests. System protects unit allocation via database transactions.
              </p>
            </div>

            <div className="border border-gray-100 p-4 rounded bg-gray-50/50">
              <span className="text-xs font-bold text-red-600 uppercase">Step 4</span>
              <h3 className="font-semibold text-gray-900 text-sm mt-1">Donation & Audit</h3>
              <p className="text-xs text-gray-600 mt-1">
                Hospital verifies donation, marks request fulfilled, and logs complete audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Participation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <Heart className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="font-bold text-gray-900 text-base">Voluntary Donors</h3>
          <p className="text-xs text-gray-600 mt-2">
            Manage your availability status, receive nearby emergency requests, and help save lives when needed.
          </p>
          <Link to="/register" className="mt-4 inline-flex items-center text-xs font-semibold text-red-600 hover:underline">
            Register as Donor <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <Building2 className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-900 text-base">Hospitals</h3>
          <p className="text-xs text-gray-600 mt-2">
            Submit verified emergency requests, monitor incoming donor responses, and confirm blood fulfillment.
          </p>
          <Link to="/register" className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600 hover:underline">
            Register Hospital <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <CheckCircle className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="font-bold text-gray-900 text-base">Blood Banks</h3>
          <p className="text-xs text-gray-600 mt-2">
            Maintain real-time blood group inventory records with transparent last-updated timestamping.
          </p>
          <Link to="/register" className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-600 hover:underline">
            Register Blood Bank <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};
