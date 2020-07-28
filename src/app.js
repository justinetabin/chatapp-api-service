
const { DependencyWorker } = require('./workers');
const DependencyContainer = require('./dependencyContainer');

const main = async () => {
  const container = new DependencyContainer();
  await container.startServices(); 
}

main();