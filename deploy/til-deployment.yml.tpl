apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{.Name}}
  namespace: {{.Namespace}}
  labels:
    app: {{.Name}}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: {{.Name}}
  template:
    metadata:
      labels:
        app: {{.Name}}
    spec:
      containers:
      - name: main
        image: {{.Image}}
        imagePullPolicy: {{.ImagePullPolicy}}
        resources:
          requests:
            cpu: 50m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 100Mi
---
apiVersion: v1
kind: Service
metadata:
  name: {{.Name}}
  namespace: {{.Namespace}}
  labels:
    app: {{.Name}}
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  selector:
    app: {{.Name}}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{.Name}}-ingress
  namespace: {{.Namespace}}
  annotations:
    cert-manager.io/cluster-issuer: cluster-issuer
    {{/* nginx.ingress.kubernetes.io/ssl-redirect: "true" */}}
    {{/* nginx.ingress.kubernetes.io/rewrite-target: / */}}
spec:
  ingressClassName: nginx
  tls:
    - hosts:
      - 'til.nxtcoder17.me'
      secretName: til.nxtcoder17.me-tls
  rules:
    - host: til.nxtcoder17.me
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{.Name}}
                port:
                  number: 80
