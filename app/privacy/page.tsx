import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Privacy Policy - OQU',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <div className="mb-4">
        <BackButton label="Назад" />
      </div>

      <div className="oqu-card p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">Privacy Policy</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          This is a short placeholder privacy policy. Replace the content below with your official policy.
        </p>

        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-200">
          <p>
            We collect the minimum data needed to provide the service and improve the experience. Your content may be
            processed to generate learning materials.
          </p>
          <p>
            We do not sell your personal data. You can request deletion of your account data at any time.
          </p>
          <p>
            For a legally compliant policy, consult a qualified professional and adapt this text to your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
