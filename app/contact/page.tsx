import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Contact - OQU',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <div className="mb-4">
        <BackButton label="Назад" />
      </div>

      <div className="oqu-card p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">Contact</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Need help or have questions? Reach us using the contacts below.
        </p>

        <div className="mt-6 space-y-3 text-slate-700 dark:text-slate-200">
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-50">Phone:</span> 87087645571
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-50">Team:</span> weshowcode
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            (Replace this placeholder with your email, social links, and legal entity details if needed.)
          </div>
        </div>
      </div>
    </div>
  );
}
