const {ECSClient, ListClustersCommand, ListServicesCommand, UpdateServiceCommand} = require("@aws-sdk/client-ecs");

exports.handler = async (event) => {
  const { action, region, clusterName, desiredCount, serviceToStop, serviceToStart } = event;

  const ecs = new ECSClient({ region });

  const clustersResponse = await ecs.send(new ListClustersCommand({}));

  console.log("clustersResponse", clustersResponse)

  const clusterArn = findClusterByName(clustersResponse.clusterArns, clusterName);

  console.log("clusterArn", clusterArn)

  const servicesResponse = await ecs.send(new ListServicesCommand({cluster: clusterArn}));
  const servicesArns = servicesResponse.serviceArns;

  if(action === 'stop') {
    return await stopServices(ecs, servicesArns, clusterArn, serviceToStop);
  } else if(action === 'start') {
    return await startServices(ecs, servicesArns, clusterArn, desiredCount, serviceToStart);
  } else {
    return {
      message: 'Action passada é inválida'
    };
  }
};

function findClusterByName(clusterArns, clusterName) {
  console.log('findClusterByName', clusterArns);

  const cluster = clusterArns.find(cluster => cluster.includes(`/${clusterName}`));

  console.log('cluster', cluster);

  return cluster;
}

async function stopServices(ecs, servicesArns, clusterArn, serviceToStop) {
  try {

    for (const serviceArn of servicesArns) {
      // TODO Melhorar verificacao
      if(serviceArn.includes(serviceToStop)) {
        console.log(`Parando service ${serviceArn}`);
        await ecs.send(new UpdateServiceCommand({cluster: clusterArn, service: serviceArn, desiredCount: 0 }));
      }
    }

    return {
      message: `O serviços foram parados com sucesso.`
    };

  } catch (error) {
    console.error('Erro ao parar o serviços:', error);
    throw error;
  }
}

async function startServices(ecs, servicesArns, clusterArn, desiredCount, serviceToStart) {
  try {

    for (const serviceArn of servicesArns) {
      // TODO Melhorar verificacao
      if(serviceArn.includes(serviceToStart)) {
        console.log(`Iniciando service ${serviceArn}`);
        await ecs.send(new UpdateServiceCommand({cluster: clusterArn, service: serviceArn, desiredCount}));
      }
    }

    return {
      message: `O serviços foram iniciados com sucesso.`
    };

  } catch (error) {
    console.error('Erro ao subir o serviços:', error);
    throw error;
  }
}

