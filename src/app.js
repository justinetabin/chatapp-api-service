
const { DependencyWorker } = require('./workers');


const main = async () => {
  const dependencyWorker = new DependencyWorker();
  await dependencyWorker.startServices(); 
}

main();