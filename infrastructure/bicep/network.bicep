@description('Location for all resources')
param location string

@description('IP address of developer machine for database access')
param developerMachineIP string

// NSG for the database subnet
resource nsg_Database 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {
  name: 'nsg-Database'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowDeveloperMachine'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '1433'
          sourceAddressPrefix: '${developerMachineIP}/32'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
    ]
  }
}

// Production virtual network: DDoS Protection Basic is enabled by default
resource vnet_WebAppStarterPack 'Microsoft.Network/virtualNetworks@2024-05-01' = {
  name: 'vnet-WebAppStarterPack'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16']
    }
    subnets: [
      {
        name: 'DatabaseSubnet'
        properties: {
          addressPrefix: '10.0.1.0/24'
          networkSecurityGroup: {
            id: nsg_Database.id
          }
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

// DNS zone
resource privateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  name: 'privatelink.database.windows.net'
  location: 'global'
}

// DNS zone link
resource privateDnsZoneLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2024-06-01' = {
  parent: privateDnsZone
  name: 'vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet_WebAppStarterPack.id
    }
  }
}

output vnetId string = vnet_WebAppStarterPack.id
output databaseSubnetId string = '${vnet_WebAppStarterPack.id}/subnets/DatabaseSubnet'
output privateDnsZoneId string = privateDnsZone.id
