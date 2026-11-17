/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  agentRules: false, // não gera o AGENTS.md (instruções para IAs) ao rodar npm run dev
};

export default nextConfig;
