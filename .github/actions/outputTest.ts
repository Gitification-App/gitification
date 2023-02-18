import actions from '@actions/core'

function run() {
  actions.setOutput('gitification', 'hello there how are you?')
}

run()
