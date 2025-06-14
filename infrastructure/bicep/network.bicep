@description('Location for all resources')
param location string

@description('IP address of developer machine for database access')
param developerMachineIP string

// NSG for the database's subnet
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

// NSG for the backend's subnet
resource nsg_Backend 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {
  name: 'nsg-Backend'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowHTTPS'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowHTTP'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 110
          direction: 'Inbound'
        }
      }
    ]
  }
}

// NSG for the frontend's subnet
resource nsg_Frontend 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {
  name: 'nsg-Frontend'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowHTTPS'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowHTTP'
        properties: {
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 110
          direction: 'Inbound'
        }
      }
    ]
  }
}

// Virtual network: DDoS Protection Basic is enabled by default
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
      {
        name: 'BackendSubnet'
        properties: {
          addressPrefix: '10.0.2.0/24'
          networkSecurityGroup: {
            id: nsg_Backend.id
          }
          privateEndpointNetworkPolicies: 'Disabled'
          delegations: [
            {
              name: 'Microsoft.App.environments'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
            }
          ]
        }
      }
      {
        name: 'FrontendSubnet'
        properties: {
          addressPrefix: '10.0.3.0/24'
          networkSecurityGroup: {
            id: nsg_Frontend.id
          }
          privateEndpointNetworkPolicies: 'Disabled'
          delegations: [
            {
              name: 'Microsoft.App.environments'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
            }
          ]
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
output backendSubnetId string = '${vnet_WebAppStarterPack.id}/subnets/BackendSubnet'
output frontendSubnetId string = '${vnet_WebAppStarterPack.id}/subnets/FrontendSubnet'
output privateDnsZoneId string = privateDnsZone.id
