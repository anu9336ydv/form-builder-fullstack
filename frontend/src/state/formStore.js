import { create } from 'zustand';

export const useFormStore = create((set) => ({
  form: {
    title: '',
    headerImage: '',
    questions: [],
  },
  setForm: (newForm) => set({ form: newForm }),
  addQuestion: (question) => set((state) => ({
    form: {
      ...state.form,
      questions: [...state.form.questions, question],
    },
  })),
  updateQuestion: (index, updatedQuestion) => set((state) => ({
    form: {
      ...state.form,
      questions: state.form.questions.map((q, i) =>
        i === index ? { ...q, ...updatedQuestion } : q
      ),
    },
  })),
  removeQuestion: (index) => set((state) => ({
    form: {
      ...state.form,
      questions: state.form.questions.filter((_, i) => i !== index),
    },
  })),
}));
