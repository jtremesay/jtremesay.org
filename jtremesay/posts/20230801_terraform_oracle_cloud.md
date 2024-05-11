---
title: Terraform + Oracle Cloud
date: 2023-08-01T23:00+02:00
---

Ce soir, j'ai été amené à découvrir [Oracle Cloud](https://cloud.oracle.com>) pour aider l'amie [Solène'%](https://dataswamp.org/~solene/).

Je ne pensais pas ça possible, mais j'ai trouvé l'expérience encore plus désagréable que celle offerte par [AWS](https://aws.amazon.com/) :D

Enfin bref. Après près d'une heure passée à essayer de créer le compte et se connecter à l'interface (oui, sérieusement), et 2 heures à potasser la doc, voila le `main.tf` que j'accoucha.

Il permet de provisionner une VM sous Oracle Linux 9.2, ainsi que tout le bazar autour (VNC, subnet, internet gateway, route table, …).

```hcl
# Go to https://cloud.oracle.com/identity/compartments/
# to get your own compartment id
variable "compartment_id" {
    type    = string
    default = "ocid1.tenancy.oc1.."
}


# eu-marseille-1
# https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm
variable "availability_domain" {
    type    = string
    default = "nLTo:EU-MARSEILLE-1-AD-1"
}


# Oracle Linux 9.2, eu-marseille-1
# https://docs.oracle.com/en-us/iaas/images/image/ba32bce1-c03a-48be-8dba-4436b1b190d3/
variable "image_id" {
    type    = string
    default = "ocid1.image.oc1.eu-marseille-1.aaaaaaaa5mugakrcfhb73itd7uvclgorricrb5n4g7ydgykxyzejqcdocqda"
}


# SSH public key
variable "ssh_public_key" {
    type    = string
    default = "ssh-rsa ... id_rsa"
}


terraform {
required_providers {

    oci = {
        source  = "oracle/oci"
        version = "5.6.0"
        }
    }
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs
provider "oci" {
    # Configuration options
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/identity_compartment
# https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm
resource "oci_identity_compartment" "sandbox" {
    compartment_id = var.compartment_id
    name           = "sandbox"
    description    = "My first compartment!"
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_vcn
# https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingVCNs.htm
resource "oci_core_vcn" "sandbox" {
    compartment_id = oci_identity_compartment.sandbox.id
    display_name   = "sandbox"
    cidr_blocks    = ["10.0.0.0/16"]
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/data-sources/core_internet_gateways
# https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingIGs.htm
resource "oci_core_internet_gateway" "sandbox" {
    compartment_id = oci_identity_compartment.sandbox.id
    vcn_id         = oci_core_vcn.sandbox.id
    display_name   = "sandbox"
    enabled        = true
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_route_table
# https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingroutetables.htm
resource "oci_core_route_table" "sandbox_igw" {
    compartment_id = oci_identity_compartment.sandbox.id
    vcn_id         = oci_core_vcn.sandbox.id
    display_name   = "sandbox-igw"
    route_rules {
        network_entity_id = oci_core_internet_gateway.sandbox.id
        destination       = "0.0.0.0/0"

    }
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_subnet
# https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingVCNs.htm
resource "oci_core_subnet" "sanbox_public" {
    cidr_block     = "10.0.0.0/24"
    compartment_id = oci_identity_compartment.sandbox.id
    vcn_id         = oci_core_vcn.sandbox.id
    display_name   = "sandbox-public"
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_route_table_attachment
resource "oci_core_route_table_attachment" "sandbox_public_igw" {
    subnet_id      = oci_core_subnet.sanbox_public.id
    route_table_id = oci_core_route_table.sandbox_igw.id
}


# https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_instance
# https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm
resource "oci_core_instance" "sandbox" {
    compartment_id      = oci_identity_compartment.sandbox.id
    availability_domain = var.availability_domain
    shape               = "VM.Standard.E2.1.Micro"
    source_details {
        source_id   = var.image_id
        source_type = "image"
    }

    display_name = "sandbox"
    create_vnic_details {
        assign_public_ip = true
        subnet_id        = oci_core_subnet.sanbox_public.id
    }
    metadata = {
        ssh_authorized_keys = var.ssh_public_key
    }
}


output "vm_ip" {
    value = oci_core_instance.sandbox.public_ip
}
```

Provisionning et connection en ssh :

```shell
$ terraform apply -auto-approve
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following
symbols:
+ create

Terraform will perform the following actions:

(…)


Plan: 7 to add, 0 to change, 0 to destroy.

Changes to Outputs:
+ vm_ip = (known after apply)

(…)

Apply complete! Resources: 7 added, 0 changed, 0 destroyed.

Outputs:

vm_ip = "144.24.203.47"

$ ssh opc@144.24.203.47
The authenticity of host '144.24.203.47 (144.24.203.47)' can't be established.
ED25519 key fingerprint is SHA256:2fDt7TNdNlHf1gprtRThKOM4mtay4Aj5XpRM5QEHgpQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '144.24.203.47' (ED25519) to the list of known hosts.
[opc@sandbox ~]$ exit
logout
```
