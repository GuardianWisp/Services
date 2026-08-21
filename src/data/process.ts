export interface ProcessStep {
  index: string;
  title: string;
}

export const processSteps: ProcessStep[] = [
  { index: "01", title: "Рассказываете о задаче" },
  { index: "02", title: "Я предлагаю решение и стоимость" },
  { index: "03", title: "Создаю и показываю результат" },
  { index: "04", title: "Передаю готовый проект" },
];
