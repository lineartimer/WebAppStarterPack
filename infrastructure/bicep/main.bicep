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

output resourceGroupName string = resourceGroup.name
output sqlServerName string = databaseModule.outputs.sqlServerName
output sqlDatabaseName string = databaseModule.outputs.sqlDatabaseName
output vnetId string = networkModule.outputs.vnetId
