---
title: Adventures in jq
tags: k8s, jq, cli
date: August 17, 2022
description: using jq
---

# Adventures in jq

I started using `jq`, a couple of weeks ago for simple json parsing tasks like
- to check conditions of k8s resource
- fetch ips from k8s nodes

### updating k8s resource spec for operator
```bash
      echo "$yamls" | yq '
        select(.kind == "Deployment") |
        .metadata.name = "{{.Name}}" |
        .metadata.namespace = "{{.Namespace}}" |
        .metadata.labels."control-plane" = "{{.Name}}" |
        .spec.selector.matchLabels."control-plane" = "{{.Name}}" |
        .spec.template.metadata.labels."control-plane" = "{{.Name}}" |
        .spec.template.spec.containers = (
          .spec.template.spec.containers | map_values(
            if .name == "manager" then
              .image = "{{.Image}}", .command = .command + ["--all"]
            else . end
          )
        )
      ' -y
```
here, we can see, if container name is `manager`, i am trying to change its `image` and `command` to some other value. But it won't work, to make it work, i will have to wrap those 2 assignments like this
```
      echo "$yamls" | yq '
        select(.kind == "Deployment") |
        .metadata.name = "{{.Name}}" |
        .metadata.namespace = "{{.Namespace}}" |
        .metadata.labels."control-plane" = "{{.Name}}" |
        .spec.selector.matchLabels."control-plane" = "{{.Name}}" |
        .spec.template.metadata.labels."control-plane" = "{{.Name}}" |
        .spec.template.spec.containers = (
          .spec.template.spec.containers | map_values(
            if .name == "manager" then
              (.image = "{{.Image}}" | .command = .command + ["--all"])
            else . end
          )
        )
      ' -y
```
