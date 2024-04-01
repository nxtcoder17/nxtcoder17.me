---
title: Oracle Cloud Setup And K3s
tags: k8s, job
description: how to save k8s job termination message, in job status
---

# Oracle Cloud Free Tier setup and K3s

### Pain
The most idiotic thing about OCI (Oracle Cloud Infrastructure) is that the pain is not only limited to getting your free account registered, 
although even after you create VMs

I had my VM running pretty easily, but was blocked by a list of nuisances
  - not able to curl/ping from outside to services running in that VM
  - since, i chose the ARM based processor, not able to run my previous amd64 based docker images
  - installed k3s, but with that k3s kubeconfig not able to connect to the cluster
  - after installing `cert-manager` in that k8s cluster, creating clusterIssuer results in `Error initializing issuer: Get "https://acme-v02.api.letsencrypt.org/directory": dial tcp: lookup acme-v02.api.letsencrypt.org on 10.43.0.10:53: server misbehaving`

Let's solve these issues one by one

### not able to curl/ping from outside to services running in that VM
OCI VMs have some weird networking setup, they not only messed up with their VPC, ingress, egress things on their dashboard, on most of the VMs they also played around `iptables`, which causes this issue

<iframe id="reddit-embed" src="https://www.redditmedia.com/r/oraclecloud/comments/r8lkf7/a_quick_tips_to_people_who_are_having_issue/?ref_source=embed&amp;ref=share&amp;embed=true" sandbox="allow-scripts allow-same-origin allow-popups" style={{border: "none"}} scrolling="yes" width="640" height="387"></iframe>

thanks, to him and his suggestions, executing these does seem to work, and make VM ready to accept outside connections
```bash
sudo iptables -I INPUT -j ACCEPT
sudo su
iptables-save > /etc/iptables/rules.v4
exit
```

### not able to run my previous `AMD64` based docker images
I read through [this artice from docker](https://docs.docker.com/build/building/multi-platform/) for building multiplatform images. 
Interestingly, one of the ways they went to build multi-platform docker images is [`QEMU`](https://www.qemu.org/), and that is pretty good, 
because almost all the cloud providers use it underneath

From the article,

> QEMU is the easiest way to get started if your node already supports it (for example. if you are using Docker Desktop). It requires no changes to your Dockerfile and BuildKit automatically detects the secondary architectures that are available. When BuildKit needs to run a binary for a different architecture, it automatically loads it through a binary registered in the binfmt\_misc handler.

>> For QEMU binaries registered with binfmt\_misc on the host OS to work transparently inside containers, they must be statically compiled and registered with the fix\_binary flag. This requires a kernel >= 4.8 and binfmt-support >= 2.1.7. You can check for proper registration by checking if F is among the flags in /proc/sys/fs/binfmt\_misc/qemu-\*. While Docker Desktop comes preconfigured with binfmt\_misc support for additional platforms, for other installations it likely needs to be installed using tonistiigi/binfmt image.

Following the article, i went ahead and copy-pasted this into my shell
```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```
now, i was able to run my amd64 image on this VM

### installed k3s, but with that k3s kubeconfig not able to connect to the cluster
this happened because ideally we install k3s by running this
```bash
curl -sfL https://get.k3s.io | sh -
```

k3s did get installed, but what happened is host's internal IP is getting advertised to k3s, so **kubeconfig** related **TLS** certs get generated with their SAN (Subject Alternative Name) pointing to the internal IP.

To resolve this we can explicitly specify the SAN we want (the external IP), with this i have been able to resolve this

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--tls-san $(curl ifconfig.co)" sh -
```

### cluster issuer getting `tcp: lookup acme-v02.api.letsencrypt.org on 10.43.0.10:53: server misbehaving`
Reading the error message, it is pretty clear it is a DNS issue, as the let's encrypt URI is not getting resolved by our k8s `coredns`

I went on and inspected the `coredns` configmap located at `kube-syste/coredns`, and going through the configurationm, i found something interesting `forward . /etc/resolv.conf`, this means this coredns does what it can, and if it does not know how to resolve some name, it delegates back to the host `/etc/resolv.conf`

and the culprit was OCI host, it's `/etc/resolv.conf` looked like this
```conf
# hl-start
nameserver 127.0.0.53
options edns0 trust-ad
search vcn07281128.oraclevcn.com
# hl-end
```

i did not understand why do i need those things as i can always have cloudflare dns (`1.1.1.1`) or google dns (`8.8.8.8`), and i will never have anything to resolve on the host level anyway

so, i removed these values, and went with cloudflare dns
```conf
nameserver 1.1.1.1
```

As soon as i did this, cert manager cluster issuer registered itself with let's encrypt, meaning it worked


### Outcome
After solving these 4 issues, now i am running this TIL service on the OCI cloud free tier, with k3s
