import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {
    const kubectlVersion = core.getInput('kubectl');
    const krewVersion = core.getInput('krew');
    const kustomizeVersion = core.getInput('kustomize');
    const helmVersion = core.getInput('helm');
    const conftestVersion = core.getInput('conftest');
    const kubevalVersion = core.getInput('kubeval');
    const ghVersion = core.getInput('gh');
    const yqVersion = core.getInput('yq');
    const argocdVersion = core.getInput('argocd');
    let toolPath = '';

    // Install kubectl
    if (kubectlVersion) {
      toolPath = tc.find('kubectl', kubectlVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://dl.k8s.io/release/v${kubectlVersion}/bin/linux/amd64/kubectl`);
        await exec.exec(`chmod +x ${downloadPath}`);
        toolPath = await tc.cacheFile(downloadPath, 'kubectl', 'kubectl', kubectlVersion);
      }
      core.addPath(toolPath);
    }

    // Install krew
    if (krewVersion) {
      toolPath = tc.find('krew', krewVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/kubernetes-sigs/krew/releases/download/v${krewVersion}/krew-linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/krew-linux_amd64`);
        await exec.exec(`${extractedPath}/krew-linux_amd64 install krew`);
        toolPath = await tc.cacheDir(extractedPath, 'krew', krewVersion);
      }
      core.addPath(`${process.env.HOME}/.krew/bin`);
    }

    // Install kustomize
    if (kustomizeVersion) {
      toolPath = tc.find('kustomize', kustomizeVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${kustomizeVersion}/kustomize_v${kustomizeVersion}_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        toolPath = await tc.cacheDir(extractedPath, 'kustomize', kustomizeVersion);
      }
      core.addPath(toolPath);
    }

    // Install helm
    if (helmVersion) {
    toolPath = tc.find('helm', helmVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://get.helm.sh/helm-v${helmVersion}-linux-amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/linux-amd64/helm`);
        toolPath = await tc.cacheFile(`${extractedPath}/linux-amd64/helm`, 'helm', 'helm', helmVersion);
      }
      core.addPath(toolPath);
    }

    // Install conftest
    if (conftestVersion) {
      toolPath = tc.find('conftest', conftestVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/open-policy-agent/conftest/releases/download/v${conftestVersion}/conftest_${conftestVersion}_Linux_x86_64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        toolPath = await tc.cacheDir(extractedPath, 'conftest', conftestVersion);
      }
      core.addPath(toolPath);
    }
  
    // Install Kubeval
    if (kubevalVersion) {
      toolPath = tc.find('kubeval', kubevalVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/instrumenta/kubeval/releases/download/v${kubevalVersion}/kubeval-linux-amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        toolPath = await tc.cacheDir(extractedPath, 'kubeval', kubevalVersion);
      }
      core.addPath(toolPath);
    }

    // Install gh
    if (ghVersion) {
      toolPath = tc.find('gh', ghVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/cli/cli/releases/download/v${ghVersion}/gh_${ghVersion}_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}/gh_${ghVersion}_linux_amd64/bin/gh`);
        toolPath = await tc.cacheFile(`${extractedPath}/gh_${ghVersion}_linux_amd64/bin/gh`, 'gh', 'gh', ghVersion);
        // toolPath = await tc.cacheDir(extractedPath, 'gh', ghVersion);
      }
      core.addPath(toolPath);
    }

    // Install yq
    if (yqVersion) {
      toolPath = tc.find('yq', yqVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/mikefarah/yq/releases/download/v${yqVersion}/yq_linux_amd64.tar.gz`);
        const extractedPath = await tc.extractTar(downloadPath);
        await exec.exec(`chmod +x ${extractedPath}`);
        toolPath = await tc.cacheFile(`${extractedPath}/yq_linux_amd64`, 'yq_linux_amd64', 'yq', yqVersion);
      }
      core.addPath(toolPath);
    }

    // Install ArgoCD
    if (argocdVersion) {
      toolPath = tc.find('argocd', argocdVersion);
      if (!toolPath) {
        const downloadPath = await tc.downloadTool(`https://github.com/argoproj/argo-cd/releases/download/v${argocdVersion}/argocd-linux-amd64`);
        await exec.exec(`chmod +x ${downloadPath}`);
        toolPath = await tc.cacheFile(downloadPath, 'argocd-linux-amd64', 'argocd', argocdVersion);
      }
      core.addPath(toolPath);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();