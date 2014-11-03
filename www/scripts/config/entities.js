import DomSpriteComponent from 'wheels-engine/components/DomSpriteComponent';
import DomAnimateOnEventComponent from 'wheels-engine/components/DomAnimateOnEventComponent';
import SoundOnEventComponent from 'wheels-engine/components/SoundOnEventComponent';
import DescriptorComponent from 'wheels-engine/components/DescriptorComponent';

export default {
	"222": {
		"components": {
			"descriptor": DescriptorComponent.create(),
			"sprite": DomSpriteComponent.create({"sprite": '222-body', "z-index": 0})
		}
		"entities": {
			"turret": {
				"components": {
					"sprite": DomSpriteComponent.create({"sprite": '222-turret', "z-index": 2}),
				},
				"entities": {
					"cannon": {
						"components": {
							"sprite": DomSpriteComponent.create({"sprite": '222-cannon', "z-index": 1}),
							"shoot-animation": DomAnimateOnEventComponent.create({
								"event": "shoot",
								"component": "sprite",
								"animation": "default-cannon-animation"
							}),
							"shoot-sound": SoundOnEventComponent.create({"event": 'shoot', sound: '222-cannon'})
						}
					}
				}
			}
		}
	},

	"T-70": {
		"components": {
			"descriptor": DescriptorComponent.create(),
			"sprite": DomSpriteComponent.create({"sprite": 't70-body', "z-index": 0})
		}
		"entities": {
			"turret": {
				"components": {
					"sprite": DomSpriteComponent.create({"sprite": 't70-turret', "z-index": 2}),
				},
				"entities": {
					"cannon": {
						"components": {
							"sprite": DomSpriteComponent.create({"sprite": 't70-cannon', "z-index": 1}),
							"shoot-animation": DomAnimateOnEventComponent.create({
								"event": "shoot",
								"component": "sprite",
								"animation": "default-cannon-animation"
							}),
							"shoot-sound": SoundOnEventComponent.create({"event": 'shoot', sound: 't70-cannon'})
						}
					}
				}
			}
		}
	},
}