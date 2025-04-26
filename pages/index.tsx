import PromptRefactorTool from "@/components/prompt-refactor-tool";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50">
      <h1 className="text-2xl font-medium mb-4 text-gray-900">Prompt Refactoring</h1>
      <PromptRefactorTool />
    </main>
  );
}
