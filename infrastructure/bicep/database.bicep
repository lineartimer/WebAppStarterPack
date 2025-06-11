@description('IP address of developer machine for database access')
param developerMachineIP string

@description('Database administrator username')
param dbAdminUsername string

@description('Database administrator password')
@secure()
param dbAdminPassword string

@description('Location for all resources')
param location string

@description('Database subnet ID from network module')
param databaseSubnetId string

@description('Private DNS zone ID from network module')
param privateDnsZoneId string

// SQL server
resource sqlServer 'Microsoft.Sql/servers@2024-05-01-preview' = {
  name: 'dbserver-webappstarterpack'
  location: location
  properties: {
    administratorLogin: dbAdminUsername
    administratorLoginPassword: dbAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2024-05-01-preview' = {
  parent: sqlServer
  name: 'db-WebAppStarterPack'
  location: location
  sku: {
    name: 'GP_S_Gen5'
    tier: 'GeneralPurpose'
    capacity: 1
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 1073741824
    autoPauseDelay: 60
    minCapacity: json('0.5')
    useFreeLimit: true
    freeLimitExhaustionBehavior: 'BillOverUsage'
    requestedBackupStorageRedundancy: 'Local'
  }
}

// Firewall rule for database to allow developer machine to connect
resource sqlFirewallRule 'Microsoft.Sql/servers/firewallRules@2024-05-01-preview' = {
  parent: sqlServer
  name: 'DeveloperMachine'
  properties: {
    startIpAddress: developerMachineIP
    endIpAddress: developerMachineIP
  }
}

// Private endpoint of the database
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-05-01' = {
  name: 'pep-Database'
  location: location
  properties: {
    subnet: {
      id: databaseSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'pep-Database'
        properties: {
          privateLinkServiceId: sqlServer.id
          groupIds: ['SqlServer']
        }
      }
    ]
  }
}

// DNS zone group
resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2024-05-01' = {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'privatelink.database.windows.net'
        properties: {
          privateDnsZoneId: privateDnsZoneId
        }
      }
    ]
  }
}

output sqlServer string = sqlServer.name
output sqlDatabase string = sqlDatabase.name
