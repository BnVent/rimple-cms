import { Route, Routes, useLocation, useNavigate, useParams } from "react-router";
import { Link, useSearchParams } from "react-router-dom";

import "./App.css";

import Posts from "./views/Posts/Posts";
import Pages from "./views/Pages";
import Styles from "./views/Styles";
import Scripts from "./views/Scripts";
import Settings from "./views/Settings";

function App() {

  const currentPath = useLocation().pathname

  const geActiveClass = itemPath => itemPath == currentPath ? "active" : ""

  return (
    <div id="app">
      <nav>
        <h1>Rimple-CMS</h1>
        <hr />
        <ul>
          <li class={geActiveClass("/")}><Link to="/">Posts</Link></li>
          <li class={geActiveClass("/pages")}><Link to="/pages">Pages</Link></li>
          <li class={geActiveClass("/styles")}><Link to="/styles">Styles</Link></li>
          <li class={geActiveClass("/scripts")}><Link to="/scripts">Scripts</Link></li>
          <li class={geActiveClass("/settings")}><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route index element={<Posts />} />
          <Route path="/pages" element={<Pages />} />
          <Route path="/styles" element={<Styles />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
