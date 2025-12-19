import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AnimatedGradientHeader } from './AnimatedGradientHeader';
import { ServicesSection } from './ServicesSection';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-097ccdc0`;

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isHidden: boolean;
}

interface FAQPageProps {
  onNavigate?: (page: 'contact') => void;
}

export function FAQPage({ onNavigate }: FAQPageProps = {}) {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/faqs`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  // Get unique categories in order
  const categories = Object.keys(groupedFaqs);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">FAQ를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <AnimatedGradientHeader 
        title="FAQ" 
        subtitle="음원 발매 절차부터 정산 가이드까지, 창작자가 가장 궁금해하는 핵심 질문들에 대한 명쾌한 해답을 드립니다."
      />

      {/* FAQ Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
            </div>
          ) : (
            categories.map((category, categoryIndex) => {
              const categoryFaqs = groupedFaqs[category];
              
              // Skip empty categories or categories with all hidden items
              if (categoryFaqs.length === 0) return null;
              
              return (
                <div key={categoryIndex} className="mb-12">
                  <h2 
                    className="text-2xl font-bold mb-6 pb-3 border-b-2 border-purple-500"
                    style={{ color: 'rgb(112, 48, 160)' }}
                  >
                    {category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {categoryFaqs.map((faq, index) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={`item-${categoryIndex}-${index}`}
                        className="border-2 border-gray-200 rounded-lg px-6 hover:border-purple-300 transition-colors"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="pr-4 font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-2 whitespace-pre-line">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })
          )}

          {/* Additional Contact Info */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">더 궁금한 사항이 있으신가요?</h3>
            <p className="text-gray-700 mb-6">
              언제든지 문의해 주세요. 친절하게 답변 드리겠습니다.
            </p>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              문의하기
            </button>
          </div>
        </div>
      </section>

      {/* Logo Section */}
      <ServicesSection />
    </div>
  );
}