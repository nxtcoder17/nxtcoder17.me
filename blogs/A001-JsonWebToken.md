---
title: Json Web Token (JWT)
tags: jwt, auth
date: November 22, 2021
description: discussing the pitfalls of symmetric encryption of JWT
---

# JWT (Json Web Token)

### Problems with Session ID:

+ Stateful machines, so scalability issues.
    - Though, can be easily turned into scalable if session ID is stored/cached on a centralized system like Redis instead of 
      the machines.

> **Symmetric Key** is when same key is used to encode and decode a value

> **Asymmetric Key** is when one key is used to encode a value, and another key is used to decode a value.

> eg. *RSA Key pair* can be used an asymmetric key pair to encode something as in `private key` will encode a value, 
> and that could only be decoded by the corresponding `public key` of that pair.
> eg. *RSA Key pair* can be used an asymmetric key pair to encode something as in `private key
> and ` will encode a value,

### Issues with Normal Usage of JWT

+ When using `symmetric key` in a micro-service architecture, the **signing secret** would need to be shared to all the 
microservices that needs authentication.
    And, that's a big loophole, as when they have the secret key, **they can also generate the JWT tokens too.**

1. hello
2. world

### How to use JWT ?

It is inevitable, that we need to use asymmetric signature in microservice architecture.

+ since, it relies on cryptography. As a general rule of cryptography
    > A key of the same size as the hash output like, 256bits for SHA256 algorithm, or larger should be used.

+ And, the secrets have their own sort of issues too,
    + Key sizes 
    + Key Management
    + Key Rotation

### Key Management

Literally, Key Rotation seems to be simple, just dumping the old key, and using a new key to sign tokens.
But the issue rises, when your service receives a token, signed by the old signature.

the way to resolve this issue, is to use a key indentifier  `kid` in jwt token itself, that would help us identify which
key has signed that token.
