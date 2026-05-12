/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  TrendingUp, 
  ReceiptText, 
  Coins, 
  AlertTriangle, 
  MessageCircle,
  Calendar,
  User
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  label: string;
  amount: number;
  isActive: boolean;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 'grocery', label: 'کریانہ', amount: 0, isActive: false },
  { id: 'mandi', label: 'منڈی', amount: 0, isActive: false },
  { id: 'roll', label: 'رول', amount: 0, isActive: false },
  { id: 'cylinder', label: 'سلنڈر', amount: 0, isActive: false },
  { id: 'spices', label: 'مصالحہ', amount: 0, isActive: false },
  { id: 'electricity', label: 'بل بجلی', amount: 0, isActive: false },
  { id: 'rent', label: 'کرایہ', amount: 0, isActive: false },
  { id: 'labor', label: 'مزدوری', amount: 0, isActive: false },
  { id: 'ketchup', label: 'کیچپ وغیرہ', amount: 0, isActive: false },
  { id: 'other', label: 'دیگر', amount: 0, isActive: false },
];

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sale1, setSale1] = useState<number | string>('');
  const [sale2, setSale2] = useState<number | string>('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);

  const totalSale = useMemo(() => {
    return (Number(sale1) || 0) + (Number(sale2) || 0);
  }, [sale1, sale2]);

  const totalExpense = useMemo(() => {
    return expenses
      .filter(ex => ex.isActive)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [expenses]);

  const netResult = totalSale - totalExpense;
  const isLoss = netResult < 0;

  const toggleExpense = (id: string) => {
    setExpenses(prev => prev.map(ex => 
      ex.id === id ? { ...ex, isActive: !ex.isActive, amount: !ex.isActive ? ex.amount : 0 } : ex
    ));
  };

  const updateExpenseAmount = (id: string, amount: string) => {
    const val = amount === '' ? 0 : parseFloat(amount);
    setExpenses(prev => prev.map(ex => 
      ex.id === id ? { ...ex, amount: val } : ex
    ));
  };

  const shareToWhatsApp = () => {
    const dateObj = new Date(date);
    const displayDate = dateObj.toLocaleDateString('ur-PK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });

    let expenseDetails = '';
    expenses.filter(ex => ex.isActive && ex.amount > 0).forEach(ex => {
      expenseDetails += `🔸 ${ex.label}: ${ex.amount.toLocaleString()}\n`;
    });

    const resultType = netResult >= 0 ? 'نفع' : 'نقصان';
    
    let reportText = '\u200F'; 
    reportText += `*🏮 ایم نوید چسکا پوائنٹ - روزانہ رپورٹ 🏮*\n\n`;
    reportText += `*📅 تاریخ:* ${displayDate}\n`;
    reportText += `*━━━━━━━━━━━━━━━━━━*\n\n`;
    reportText += `💰 سیل 1: ${(Number(sale1) || 0).toLocaleString()}\n`;
    reportText += `💰 سیل 2: ${(Number(sale2) || 0).toLocaleString()}\n`;
    reportText += `*💵 ٹوٹل سیل: ${totalSale.toLocaleString()}*\n\n`;
    
    reportText += `*💸 اخراجات:*\n`;
    if (expenseDetails) {
      reportText += expenseDetails;
    } else {
      reportText += `کوئی خرچہ نہیں\n`;
    }
    reportText += `*🔴 ٹوٹل خرچہ: ${totalExpense.toLocaleString()}*\n\n`;
    reportText += `*━━━━━━━━━━━━━━━━━━*\n`;
    reportText += `*📊 نتیجہ*\n`;
    reportText += `*✨ کل ${resultType}: ${Math.abs(netResult).toLocaleString()}*\n`;
    reportText += `*━━━━━━━━━━━━━━━━━━*\n\n`;
    reportText += `_🙏 ہمیشہ نماز کی پابندی کریں _`;

    const whatsappNumber = '923458081903';
    const encodedText = encodeURIComponent(reportText);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-orange-50 font-urdu selection:bg-orange-200" dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-col shadow-2xl min-h-screen md:min-h-0 md:my-8 md:rounded-2xl overflow-hidden border-b-4 border-brand-dark">
        
        {/* Header */}
        <header className="bg-brand text-white p-6 shadow-lg border-b-4 border-brand-dark flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-white shadow-inner shrink-0">
              <div className="w-10 h-10 border-4 border-brand rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-brand rounded-full"></div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-nastaliq">ایم نوید چسکا پوائنٹ</h1>
              <p className="text-orange-200 text-lg opacity-90">رینالہ خورد — روزانہ سیلز رپورٹ</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg border border-white/20 text-center min-w-[150px]">
            <div className="text-xs uppercase tracking-widest text-orange-200 mb-1">موجودہ تاریخ</div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-2xl font-mono text-center outline-none cursor-pointer w-full"
            />
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 bg-white">
          {/* Sales Sidebar */}
          <section className="md:col-span-4 bg-white border-l border-orange-100 p-8 flex flex-col gap-6">
            <div className="border-r-8 border-brand pr-4 mb-4">
              <h2 className="text-3xl font-extrabold text-slate-800">سیلز (Sales)</h2>
              <p className="text-slate-500 text-lg">روزانہ کی نقد آمدن درج کریں</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 focus-within:border-brand transition-colors">
                <label className="block text-lg font-bold text-slate-600 mb-2">پہلی شفٹ (صبح)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={sale1}
                    onChange={(e) => setSale1(e.target.value)}
                    placeholder="0"
                    className="text-4xl font-mono text-slate-800 bg-transparent w-full outline-none ltr"
                  />
                  <span className="text-sm font-urdu opacity-50 font-bold">PKR</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 focus-within:border-brand transition-colors">
                <label className="block text-lg font-bold text-slate-600 mb-2">دوسری شفٹ (شام)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={sale2}
                    onChange={(e) => setSale2(e.target.value)}
                    placeholder="0"
                    className="text-4xl font-mono text-slate-800 bg-transparent w-full outline-none ltr"
                  />
                  <span className="text-sm font-urdu opacity-50 font-bold">PKR</span>
                </div>
              </div>

              <div className="bg-blue-600 p-6 rounded-xl text-white shadow-xl mt-8 transform transition-transform hover:scale-[1.02]">
                <div className="text-sm opacity-80 mb-1 font-bold uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={16} /> ٹوٹل سیلز
                </div>
                <div className="text-6xl font-mono ltr">{totalSale.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mt-8 text-slate-400 italic text-lg border-t pt-4 font-nastaliq">
              نوٹ: تمام سیلز ریکارڈ کی تصدیق کی جا چکی ہے۔
            </div>
          </section>

          {/* Expenses Main Section */}
          <section className="md:col-span-8 p-8 flex flex-col bg-slate-50/30">
            <div className="border-r-8 border-brand pr-4 mb-8">
              <h2 className="text-3xl font-extrabold text-slate-800">اخراجات (Expenses)</h2>
              <p className="text-slate-500 text-lg">آج کے تمام کاروباری اخراجات</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {expenses.map((ex, index) => (
                <div 
                  key={ex.id}
                  className={`flex justify-between items-center p-3 bg-white border rounded-xl shadow-sm transition-all ${
                    ex.isActive ? 'border-brand ring-2 ring-brand/10' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-orange-100 text-brand-dark px-2 py-1 rounded text-sm font-mono ltr">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={ex.isActive}
                        onChange={() => toggleExpense(ex.id)}
                        className="w-5 h-5 accent-brand cursor-pointer"
                      />
                      <span className="font-bold text-xl text-slate-700">{ex.label}</span>
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {ex.isActive && (
                      <motion.input 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        type="number"
                        value={ex.amount || ''}
                        onChange={(e) => updateExpenseAmount(ex.id, e.target.value)}
                        placeholder="رقم"
                        className="w-24 p-2 text-left rounded-lg border-2 border-brand/20 focus:border-brand outline-none ltr font-mono text-lg"
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-6 items-stretch">
              <div className="flex-1 bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px]">
                <div className="flex justify-between items-end">
                  <div className="text-red-700 font-bold text-xl flex items-center gap-2">
                    <ReceiptText size={20} /> ٹوٹل اخراجات
                  </div>
                  <div className="text-4xl font-mono text-red-800 ltr">{totalExpense.toLocaleString()}</div>
                </div>
              </div>
              
              <div className={`flex-1 border p-6 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px] ${
                isLoss ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <div className="flex justify-between items-end">
                  <div className="font-bold text-xl flex items-center gap-2">
                    {isLoss ? <AlertTriangle size={20} /> : <Coins size={20} />}
                    {isLoss ? 'نقصان (Loss)' : 'نفع (Profit)'}
                  </div>
                  <div className="text-4xl font-mono ltr flex items-center">
                    {!isLoss && '+'}
                    {netResult.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-slate-900 flex flex-col md:flex-row items-center p-8 border-t border-slate-800 justify-between gap-6">
          <div className="flex items-center gap-8 text-slate-400">
            <div className="flex flex-col text-center md:text-right">
              <span className="text-[10px] uppercase tracking-widest opacity-60">پروپرائیٹر</span>
              <span className="text-2xl text-white font-bold underline decoration-brand decoration-2 underline-offset-4">
                محمد نوید خان
              </span>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-700"></div>
            <div className="text-lg italic font-nastaliq hidden lg:block">
              ہمیشہ نماز کی پابندی کریں اور رزقِ حلال کمائیں۔
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareToWhatsApp}
            className="bg-[#25D366] hover:bg-[#128c7e] text-white h-16 px-10 rounded-full font-bold text-2xl flex items-center gap-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] cursor-pointer transition-colors"
          >
            <MessageCircle size={28} fill="white" />
            رپورٹ واٹس ایپ کریں
          </motion.button>
        </footer>
      </div>
    </div>
  );
}
