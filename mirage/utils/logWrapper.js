export default function logWrapper(...args) {
  if(!process.env.NO_LOGGING) console.log(...args);
}