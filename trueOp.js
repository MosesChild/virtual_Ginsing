var trueOp = function (options) {
     const ampEnv = new Tone.AmplitudeEnvelope().toDestination(),
          osc = new Tone.OmniOscillator({ type: "sine" })
               .connect(ampEnv)
               .start(),
          freqEnv = new Tone.FrequencyEnvelope({
               octaves: 5 / 12,
               baseFrequency: "C2",
               sustain: 1,
               release: 0,
          }).connect(osc.frequency);

     osc.set({ volume: options ? options.volume || 0 : 0 }).connect(ampEnv);
     const oscillator = osc.get();
     const filterKeys = Object.keys(oscillator).filter(
          (key) => ["mute","frequency"].indexOf(key) < 0
     );
     const quickSet = {};
     filterKeys.forEach((key) => (quickSet[key] = oscillator[key]));
     quickSet.frequency=freqEnv.baseFrequency;
     console.log(oscillator, filterKeys, "quickSet,");
     // best parameters for op are: freqEnvelope.baseFrequency, oscillator.type, volume, detune, portamento

     return {
          name: "trueOp",
          audioCtx: Tone.getContext(),
          oscillator: osc,
          envelope: ampEnv,
          frequencyEnv: freqEnv,
          volume: osc.volume,
          detune: osc.detune,
          follow: true,
          oscOffset: 0, // used to tune incoming note up or down semitones.

          get: function () {
               return Object.assign(quickSet, {
                    portamento: "not implemented",
                    envelope: ampEnv.get(),
                    oscillator: osc.get(),
                    frequencyEnv: freqEnv.get(),
               });
          },
          set: function(object = {}) {
               const setMe = Object.keys(object).filter(
                    (key) => filterKeys.indexOf(key) > -1
               );
               if (object.portamento) {
                    this.portamento = object.portamento;
                    delete object.portamento;
               }
               if (setMe.length[0])
                    console.error(
                         `Can't set ${setMe} parameter at root object`
                    );
               console.log('set by trueOsc set', object);
               osc.set(object);
          },
          triggerAttack: function (note, velocity) {
               freqEnv.set({ frequency: note });

               ampEnv.triggerAttack("0", velocity ? velocity : 1);
          },
          triggerAttackRelease: function (note, duration, velocity) {

               if (this.follow === true) {

                    freqEnv.set({ baseFrequency: note });
               }

               freqEnv.triggerAttackRelease(duration);
               ampEnv.triggerAttackRelease(duration);

          },
          triggerRelease: function triggerRelease() {
               ampEnv.triggerRelease();
          },
     };
};

export { trueOp };