export default function getBaseUrl() {
  const inDevelopment = window.location.hostname === "0.0.0.0";
  return inDevelopment ? "http://0.0.0.0:3003/" : "/";
};
