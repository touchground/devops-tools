import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {
    const kubectlVersion = core.getInput('kubectl');
    const dockerVersion = core.getInput('docker');
    const krewVersion = core.getInput('krew');
    const kustomizeVersion = core.getInput('kustomize');
    const helmVersion = core.getInput('helm');
    const conftestVersion = core.getInput('conftest');
    const kubevalVersion = core.getInput('kubeval');
    const ghVersion = core.getInput('gh');
    const yqVersion = core.getInput('yq');
    const argocdVersion = core.getInput('argocd');
    let toolPath = '';
    let myOutput = '';
    let myError = '';

    const options: exec.ExecOptions = {};
    options.listeners = {
        stdout: (data: Buffer) => {
            myOutput += data.toString();
        },
        stderr: (data: Buffer) => {
            myError += data.toString();
        }
    };
    options.silent = true;

    // Install kubectl
    if (kubectlVersion) {
      toolPath = tc.find('tg-kubectl', kubectlVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://dl.k8s.io/release/v${kubectlVersion}/bin/linux/amd64/kubectl`);
        await exec.exec(`chmod +x ${downloadPath}`, [], options);
        toolPath = await tc.cacheFile(downloadPath, 'tg-kubectl', 'tg-kubectl', kubectlVersion);
      }
      core.addPath(toolPath);
      // Show kubectl version
      await exec.exec(`echo "====== Kubectl "======"`, [], options);
      await exec.exec(`tg-kubectl version --client`, [], options);
      await exec.exec(`which tg-kubectl`, [], options);
    }

    // Install docker
    if (dockerVersion) {
      toolPath = tc.find('tg-docker', dockerVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://download.docker.com/linux/static/stable/x86_64/docker-${dockerVersion}.tgz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/docker`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/docker`, 'tg-docker', 'tg-docker', dockerVersion);
      }
      core.addPath(toolPath);
      // Show docker version
      await exec.exec(`echo "====== Docker "======"`, [], options);
      await exec.exec('tg-docker', ['--version'], options);
      await exec.exec(`which tg-docker`, [], options);
    }

    // Install krew
    if (krewVersion) {
      toolPath = tc.find('krew', krewVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/kubernetes-sigs/krew/releases/download/v${krewVersion}/krew-linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/krew-linux_amd64`, [], options);
        await exec.exec(`${extractedPath}/krew-linux_amd64 install krew`, [], options);
        toolPath = await tc.cacheDir(extractedPath, 'krew', krewVersion);
      }
      core.addPath(`${process.env.HOME}/.krew/bin`);
      // Show krew version
      await exec.exec(`echo "====== Krew "======"`, [], options);
      await exec.exec(`tg-kubectl krew version`, [], options);
    }

    // Install kustomize
    if (kustomizeVersion) {
      toolPath = tc.find('tg-kustomize', kustomizeVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${kustomizeVersion}/kustomize_v${kustomizeVersion}_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/kustomize`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/kustomize`, 'tg-kustomize', 'tg-kustomize', kustomizeVersion);
      }
      core.addPath(toolPath);
      // Show kustomize version
      await exec.exec(`echo "====== Kustomize "======"`, [], options);
      await exec.exec('tg-kustomize', ['version'], options);
      await exec.exec(`which tg-kustomize`, [], options);
    }

    // Install helm
    if (helmVersion) {
    toolPath = tc.find('tg-helm', helmVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://get.helm.sh/helm-v${helmVersion}-linux-amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/linux-amd64/helm`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/linux-amd64/helm`, 'tg-helm', 'tg-helm', helmVersion);
      }
      core.addPath(toolPath);
      // Show helm version
      await exec.exec(`echo "====== Helm "======"`, [], options);
      await exec.exec('tg-helm version --short', [], options);
      await exec.exec(`which tg-helm`, [], options);
    }

    // Install conftest
    if (conftestVersion) {
      toolPath = tc.find('tg-conftest', conftestVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/open-policy-agent/conftest/releases/download/v${conftestVersion}/conftest_${conftestVersion}_Linux_x86_64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/conftest`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/conftest`, 'tg-conftest', 'tg-conftest', conftestVersion);
      }
      core.addPath(toolPath);
      // Show conftest version
      await exec.exec(`echo "====== Conftest "======"`, [], options);
      await exec.exec('tg-conftest', ['--version'], options);
      await exec.exec(`which tg-conftest`, [], options);
    }
  
    // Install kubeval
    if (kubevalVersion) {
      toolPath = tc.find('tg-kubeval', kubevalVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/instrumenta/kubeval/releases/download/v${kubevalVersion}/kubeval-linux-amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/kubeval`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/kubeval`, 'tg-kubeval', 'tg-kubeval', kubevalVersion);
      }
      core.addPath(toolPath);
      // Show kubeval version
      await exec.exec(`echo "====== Kubeval "======"`, [], options);
      await exec.exec('tg-kubeval', ['--version'], options);
      await exec.exec(`which tg-kubeval`, [], options);
    }

    // Install gh
    if (ghVersion) {
      toolPath = tc.find('tg-gh', ghVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/cli/cli/releases/download/v${ghVersion}/gh_${ghVersion}_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/gh_${ghVersion}_linux_amd64/bin/gh`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/gh_${ghVersion}_linux_amd64/bin/gh`, 'tg-gh', 'tg-gh', ghVersion);
        // toolPath = await tc.cacheDir(extractedPath, 'tg-gh', ghVersion);
      }
      core.addPath(toolPath);
      // Show gh version
      await exec.exec(`echo "====== GitHub CLI "======"`, [], options);
      await exec.exec('tg-gh', ['version'], options);
      await exec.exec(`which tg-gh`, [], options);
    }

     // Install yq
     if (yqVersion) {
      // toolPath = tc.find('tg-yq', yqVersion);
      // if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/mikefarah/yq/releases/download/v${yqVersion}/yq_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/yq_linux_amd64`, [], options);
        toolPath = await tc.cacheFile(`${extractedPath}/yq_linux_amd64`, 'tg-yq', 'tg-yq', yqVersion);
        core.addPath(toolPath);
      // }
      
      // Show yq version
      await exec.exec(`echo "====== YQ "======"`, [], options);
      await exec.exec('tg-yq', ['--version'], options);
      await exec.exec(`which tg-yq`, [], options);
    }

    // Install argocd
    if (argocdVersion) {
      toolPath = tc.find('tg-argocd', argocdVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/argoproj/argo-cd/releases/download/v${argocdVersion}/argocd-linux-amd64`);
        const parentDirectory = path.dirname(downloadPath);
        await exec.exec(`sudo install -m 555 ${downloadPath} ${parentDirectory}/argocd`, [], options);
        await exec.exec(`chmod +x ${parentDirectory}`, [], options)
        toolPath = await tc.cacheFile(`${parentDirectory}/argocd`, 'tg-argocd', 'tg-argocd', argocdVersion);
      }
      core.addPath(toolPath);
      // Show argocd version
      await exec.exec(`echo "====== ArgoCD "======"`, [], options);
      await exec.exec(`tg-argocd version --client`, [], options);
      await exec.exec(`which tg-argocd`, [], options);
    }

    console.log('All tools installed successfully:\n', myOutput);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
