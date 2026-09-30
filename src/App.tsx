import { ClassicView } from "./classic/ClassicView";
import { LanguageProvider } from "./i18n/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <ClassicView />
    </LanguageProvider>
  );
}
