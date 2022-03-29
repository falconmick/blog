import React, { useContext, useState } from "react";

const defaultValue = {
  mode: "light",
  setMode: () => {},
  isDark: false,
  isLight: true,
}

const DarkModeContext = React.createContext(defaultValue);

const useDarkModeContext = () => useContext(DarkModeContext);
export default useDarkModeContext;

export const DarkModeProvider = ({children}) => {
  const [mode, setMode] = useState(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("mode") || "light"
      : "light"
  );

  React.useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mode", mode)
    }
  }, [mode]);

  return (
    <DarkModeContext.Provider value={{
      mode,
      setMode,
      isDark: mode === "dark",
      isLight: mode ==="light",
    }}>
      {children}
    </DarkModeContext.Provider>
  )
};