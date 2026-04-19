import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surveyQuestions, blockInfo } from '@/data/surveyData';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ChevronRight, Send, Search } from 'lucide-react';

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = surveyQuestions?.length ?? 0;
  const question = currentIndex >= 0 && currentIndex < total ? surveyQuestions[currentIndex] : null;
  const block = question ? blockInfo[question.block] : null;

  const setAnswer = (val: any) => {
    if (question) setAnswers((prev) => ({ ...prev, [question.id]: val }));
  };

  const canProceed = currentIndex === -1 || !question || (
    answers[question.id] !== undefined && 
    answers[question.id] !== null && 
    answers[question.id] !== '' && 
    !(Array.isArray(answers[question.id]) && answers[question.id].length === 0)
  );

  const next = () => {
    if (!canProceed) return;
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
    else setSubmitted(true);
  };

  const prev = () => {
    if (currentIndex > -1) setCurrentIndex((i) => i - 1);
  };

  if (submitted) {
    return (
      <div className="survey-container flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="survey-card p-8 sm:p-12 text-center max-w-lg"
        >
          <div className="text-6xl mb-4">💛</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Muito obrigado!
          </h1>
          <p className="text-muted-foreground mb-2">
            Suas respostas contribuem diretamente para esta pesquisa acadêmica.
          </p>
          <p className="text-xs text-muted-foreground">
            Centro Universitário SENAC · Administração · 2026
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="survey-container flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {currentIndex === -1 ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="survey-card p-8 sm:p-10 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/15 text-foreground rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                <Search className="w-4 h-4" />
                Pesquisa de Percepção
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Grupo Cimed
              </h1>
              <p className="text-lg text-muted-foreground mb-6 font-medium">
                Marca · Produto · Consumo
              </p>
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground text-left mb-8 leading-relaxed">
                Você foi convidado(a) a participar de uma pesquisa acadêmica sobre percepção de marca e
                hábitos de consumo relacionados ao Grupo Cimed. Suas respostas são <strong className="text-foreground">anônimas</strong> e
                levam cerca de <strong className="text-foreground">8 minutos</strong>. Não há respostas certas ou erradas.
              </div>
              <button onClick={next} className="survey-btn-primary w-full sm:w-auto">
                Começar pesquisa <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div key={currentIndex}>
              {block && (
                <ProgressBar
                  current={currentIndex}
                  total={total}
                  blockTitle={block.title}
                  blockIcon={block.icon}
                />
              )}
              {question && (
                <QuestionCard
                  question={question}
                  answer={answers[question.id]}
                  onAnswer={setAnswer}
                />
              )}
              <div className="flex justify-between mt-5 gap-3">
                <button onClick={prev} className="survey-btn-secondary">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
                <button onClick={next} disabled={!canProceed} className={`survey-btn-primary ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {currentIndex === total - 1 ? (
                    <>Enviar <Send className="w-4 h-4" /></>
                  ) : (
                    <>Próxima <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
