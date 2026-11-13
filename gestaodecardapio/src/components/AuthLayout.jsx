import { motion } from 'framer-motion';

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white/90 shadow-sm backdrop-blur-sm p-6 sm:p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-100">
            {Icon ? <Icon className="h-8 w-8" /> : null}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-stone-800">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-stone-500">{subtitle}</p> : null}
        </div>

        {children}

        {footer ? <p className="mt-6 text-center text-sm text-stone-500">{footer}</p> : null}
      </motion.div>
    </div>
  );
}
