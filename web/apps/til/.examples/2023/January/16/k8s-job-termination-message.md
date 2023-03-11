---
title: K8s Job Termination Message
tags: k8s, job
description: how to save k8s job termination message, in job status
---

# K8s Job Termination Message

### Pain
Once we are dealing with kubernetes jobs
- when `k8s job fails`, i.e. `when pods created by job controller exits with non-zero status`, to extract out the exact reason for that unexpected failure is to read through logs from those pods
- in cases, where we have deleted the failed pods, good luck trying to find the reason for job failure later on.

By default, Kubernetes Job Controller does not save those termination logs, but they definitely provide us a way to save those termination messages.

### how it works
if job command (`.spec.template.spec.containers[].command`) writes its failure message (_or anything_) to `/dev/termination-log` (default value), k8s job controller would save the contents of this file in job definition itself, at json path `.status.containerStatuses.state.terminated.message`, which enables us to refer to the cause of job failure even later on

### adventures for a solution

possible ways could be:
- redirect the command stderr to `/dev-termination-log`
```sh
command-that-might-fail 2> /dev/termination-log
```
- if in need of more context, redirect both stdout and stderr to `/dev/termination-log`
```sh
command-that-might-fail 2>&1 /dev/termination-log
```

But, with this approach, error won't show up in pod logs, dumped directly to file, which is not quite acceptable

To resolve it, instead of directly writing to a file, we can use `tee` to write to **file and stdout** aswell, like
```bash
command-that-might-fail 2> | tee /dev/termination-log
```
But, there is a catch to that fix, now the job program that `exited with a non-zero status` would show up as `Success`, because exit code is coming from `tee` now.

That is why, we would need to set this bash option `set -o pipefail` prior to running the job command, now we will get correct exit code

### Code Reference
```go
batchv1.Job{
    TypeMeta: metav1.TypeMeta{
        Kind:       "Job",
        APIVersion: "batchv1",
    },
    ObjectMeta: metav1.ObjectMeta{
        Name:      "sample",
        Namespace: "default",
    },
    Spec: batchv1.JobSpec{
        Template: corev1.PodTemplateSpec{
            Spec: corev1.PodSpec{
            RestartPolicy: "Never",
            Containers: []corev1.Container{
                {
                    Name:            "main",
                    Image:           "vectorized/redpanda:v22.1.6",
                    ImagePullPolicy: "IfNotPresent",
                    Command: []string{
                        "bash",
                        "-c",
                        fmt.Sprintf(
                        `
                            #hl-start
                            set -o pipefail
                            rpk topic create %s --brokers %s | tee /dev/termination-log
                            #hl-end
                        `, obj.Name, redpandaHosts,
                        ),
                    },
                },
            },
        },
    },
}
```
