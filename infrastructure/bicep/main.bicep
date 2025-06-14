targetScope = 'subscription'

@description('Location for all resources')
param location string

@description('IP address of developer machine for database access')
param developerMachineIP string

@description('Database administrator username')
param dbAdminUsername string

@description('Database administrator password')
@secure()
param dbAdminPassword string

// Resource group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-WebAppStarterPack'
  location: location
}

// Network components
module networkModule 'network.bicep' = {
  scope: resourceGroup
  name: 'network-deployment'
  params: {
    location: location
    developerMachineIP: developerMachineIP
  }
}

// Database components
module databaseModule 'database.bicep' = {
  scope: resourceGroup
  name: 'database-deployment'
  dependsOn: [networkModule]
  params: {
    location: location
    developerMachineIP: developerMachineIP
    dbAdminUsername: dbAdminUsername
    dbAdminPassword: dbAdminPassword
    databaseSubnetId: networkModule.outputs.databaseSubnetId
    privateDnsZoneId: networkModule.outputs.privateDnsZoneId
  }
}

// Container components
module containersModule 'containers.bicep' = {
  scope: resourceGroup
  name: 'container-deployment'
  dependsOn: [networkModule]
  params: {
    location: location
    backendSubnetId: networkModule.outputs.backendSubnetId
    frontendSubnetId: networkModule.outputs.frontendSubnetId
  }
}

output resourceGroup string = resourceGroup.name
output vnetId string = networkModule.outputs.vnetId
output sqlServer string = databaseModule.outputs.sqlServer
output sqlDatabase string = databaseModule.outputs.sqlDatabase
output containerRegistry string = containersModule.outputs.containerRegistry
output backend string = containersModule.outputs.backend
output frontend string = containersModule.outputs.frontend
