import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Architecture from "./pages/Architecture";
import LiveDemo from "./pages/LiveDemo";
import AttackReplay from "./pages/AttackReplay";
import Findings from "./pages/Findings";
import Results from "./pages/Results";
import Methodology from "./pages/Methodology";
import OwaspMapping from "./pages/OwaspMapping";
import Reports from "./pages/Reports";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="live-demo" element={<LiveDemo />} />
          <Route path="attack-replay" element={<AttackReplay />} />
          <Route path="findings" element={<Findings />} />
          <Route path="results" element={<Results />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="mapping" element={<OwaspMapping />} />
          <Route path="reports" element={<Reports />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
