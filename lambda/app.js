const {ECSClient, ListClustersCommand, ListServicesCommand, UpdateServiceCommand} = require("@aws-sdk/client-ecs");

exports.handler = async (event) => {
  const { action, region, clusterName, desiredCount } = event;

  const ecs = new ECSClient({ region });

  const clustersResponse = await ecs.send(new ListClustersCommand({}));

  const clusterArn = findClusterByName(clustersResponse.clusterArns, clusterName);
  const servicesResponse = await ecs.send(new ListServicesCommand({cluster: clusterArn}));
  const servicesArns = servicesResponse.serviceArns;

  if(action === 'stop') {
    return await stopServices(ecs, servicesArns, clusterArn);
  } else if(action === 'start') {
    return await startServices(ecs, servicesArns, clusterArn, desiredCount);
  } else {
    return {
      message: 'Action passada é inválida'
    };
  }
};

function findClusterByName(clusterArns, clusterName) {
  return clusterArns.find(cluster => cluster.includes(`:${clusterName}/`));
}

async function stopServices(ecs, servicesArns, clusterArn) {
  try {

    for (const serviceArn of servicesArns) {
      console.log(`Parando service ${serviceArn}`);
      await ecs.send(new UpdateServiceCommand({cluster: clusterArn, service: serviceArn, desiredCount: 0 }));
    }

    return {
      message: `O serviços foram parados com sucesso.`
    };

  } catch (error) {
    console.error('Erro ao parar o serviços:', error);
    throw error;
  }
}

async function startServices(ecs, servicesArns, clusterArn, desiredCount) {
  try {

    for (const serviceArn of servicesArns) {
      console.log(`Iniciando service ${serviceArn}`);
      await ecs.send(new UpdateServiceCommand({cluster: clusterArn, service: serviceArn, desiredCount }));
    }

    return {
      message: `O serviços foram iniciados com sucesso.`
    };

  } catch (error) {
    console.error('Erro ao subir o serviços:', error);
    throw error;
  }
}

