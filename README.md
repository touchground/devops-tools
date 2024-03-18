# devops-tools
devops-tools is a simple GitHub Action that installs kubectl, helm, kustomize, etc. in the an action runner.  Cached versions are used if available.

Specific versions for the commands can be setup by adding inputs parameters like this:
```yaml
  test: 
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: touchground/devops-tools@main
      with:
        kubectl: '1.20.0'
        helm: '3.4.2'
        kustomize: '3.8.8'
```